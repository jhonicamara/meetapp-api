import * as Yup from 'yup';
import { parseISO, isBefore } from 'date-fns';
import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

class MeetupController {
  async index(require, response) {
    const meetups = await Meetup.findAll({
      where: { user_id: require.userId },
      order: ['date'],
      attributes: ['id', 'title', 'user_id', 'date'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name']
        }
      ]
    });

    return response.json(meetups);
  }

  async show(require, response) {
    const meetup = await Meetup.findOne({
      where: { id: require.params.id },
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
    });

    if (!meetup) {
      return response.status(400).json({ error: 'Meetup do not exist' });
    }

    return response.json(meetup);
  }

  async store(require, response) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      image_id: Yup.number().required()
    });

    if (!(await schema.isValid(require.body))) {
      return response.status(400).json({ error: 'Validation fails' });
    }

    const { title, description, location, date, image_id } = require.body;

    const parsedDate = parseISO(date);

    if (isBefore(parsedDate, new Date())) {
      return response
        .status(400)
        .json({ error: 'Past dates are not permited' });
    }

    const meetup = await Meetup.create({
      title,
      description,
      location,
      date,
      user_id: require.userId,
      image_id
    });

    return response.json(meetup);
  }

  async update(require, response) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      location: Yup.string(),
      date: Yup.date(),
      image_id: Yup.number()
    });

    if (!(await schema.isValid(require.body))) {
      return response.status(400).json({ error: 'Validation fails' });
    }

    const meetup = await Meetup.findByPk(require.params.id);

    if (!meetup) {
      return response.status(400).json({ error: 'Meetup does not exist' });
    }

    if (!(require.userId === meetup.user_id)) {
      return response.status(401).json({ error: 'User unhathorized' });
    }

    const parsedDate = parseISO(meetup.date);

    if (isBefore(parsedDate, new Date())) {
      return response
        .status(400)
        .json({ error: 'You can not edit past meetups' });
    }

    const {
      title,
      description,
      location,
      date,
      image_id
    } = await meetup.update(require.body);

    return response.json({
      title,
      description,
      location,
      date,
      image_id
    });
  }

  async delete(require, response) {
    const meetup = await Meetup.findByPk(require.params.id);

    if (!meetup) {
      return response.status(400).json({ error: 'Meetup does not exist' });
    }

    if (!(require.userId === meetup.user_id)) {
      return response.status(401).json({ error: 'User unhathorized' });
    }

    const parsedDate = parseISO(meetup.date);

    if (isBefore(parsedDate, new Date())) {
      return response
        .status(400)
        .json({ error: 'You can not delete past meetups' });
    }

    await meetup.destroy();

    return response.status(201).send();
  }
}

export default new MeetupController();
