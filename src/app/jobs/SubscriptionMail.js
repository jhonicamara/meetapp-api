import Mail from '../../lib/Mail';

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail';
  }

  async handle({ data }) {
    const { meetEmail, user } = data;

    Mail.sendMail({
      to: `${meetEmail.user.name} <${meetEmail.user.email}>`,
      subject: 'Nova inscrição no seu meetup',
      template: 'subscription',
      context: {
        creator: meetEmail.user.name,
        user: user.name,
        email: user.email,
        meetup: meetEmail.title
      }
    });
  }
}

export default new SubscriptionMail();
