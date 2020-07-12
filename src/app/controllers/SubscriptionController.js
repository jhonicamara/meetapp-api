import * as Yup from 'yup';
import { isBefore } from 'date-fns';
import { Op } from 'sequelize';

import User from '../models/User';
import File from '../models/File';
import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';

import Queue from '../../lib/Queue';
import SubscriptionMail from '../jobs/SubscriptionMail';

class SubscriptionController {
  async index(require, response) {
    const subscriptions = await Subscription.findAll({
      where: {
        user_id: require.userId
      },
      include: [
        {
          model: Meetup,
          as: 'meetup',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name']
            },
            {
              model: File,
              as: 'image'
            }
          ]
        }
      ]
    });

    return response.json(
      subscriptions.filter(sub =>
        isBefore(new Date(), new Date(sub.meetup.date))
      )
    );
  }

  async store(require, response) {
    const schema = Yup.object().shape({
      meetup_id: Yup.number().required()
    });

    if (!(await schema.isValid(require.body))) {
      return response.status(400).json({ error: 'Validation fails' });
    }

    const { meetup_id } = require.body;

    const meetup = await Meetup.findByPk(meetup_id);

    const user = await User.findByPk(require.userId);

    const checkIsCreator = await Meetup.findOne({
      where: { user_id: require.userId }
    });

    if (checkIsCreator) {
      return response.status(400).json({
        error: 'You can not subscribe in a meetup that you created'
      });
    }

    const checkSubscription = await Subscription.findOne({
      where: { user_id: require.userId, meetup_id: require.body.meetup_id }
    });

    if (checkSubscription) {
      return response
        .status(400)
        .json({ error: 'You already have a subscription on this meetup' });
    }

    if (isBefore(meetup.date, new Date())) {
      return response
        .status(400)
        .json({ error: 'You can not subscribe to a past meetup' });
    }

    const subAlready = await Subscription.findOne({
      where: {
        user_id: require.userId
      },
      include: [
        {
          model: Meetup,
          as: 'meetup',
          where: {
            date: meetup.date
          }
        }
      ]
    });

    if (subAlready) {
      return response.status(400).json({
        error: 'You already subscribe in another meetup in this horary'
      });
    }

    const subscription = await Subscription.create({
      user_id: require.userId,
      meetup_id
    });

    const meetEmail = await Meetup.findByPk(meetup_id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email']
        }
      ]
    });

    await Queue.add(SubscriptionMail.key, {
      meetEmail,
      user
    });

    return response.json(subscription);
  }

  async delete(require, response) {
    const subscription = await Subscription.findOne({
      where: { id: require.params.id }
    });

    if (!subscription) {
      return response.status(401).json({ error: 'Subscription not found' });
    }

    if (subscription.user_id !== require.userId) {
      return response.status(401).json({
        error: 'You do not have permission to cancel this subscription'
      });
    }

    await subscription.destroy();

    return response.status(201).send();
  }
}

export default new SubscriptionController();
