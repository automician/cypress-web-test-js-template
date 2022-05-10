import { UserInfo } from '../data';
import { RESTful } from '../../../../api/restful.resource';
import { request } from '../../../../api/request';
import { settings } from '../../../../project.settings';

export const auth = {
  ...RESTful.Resource({ name: 'auth' }),

  /** @param {UserInfo} user*/
  signin_POST(user) {
    return request.POST({
      url: `${this.url}/signin`,
      body: {
        email: user.email,
        password: user.password,
      },
    });
  },

  recoveryCode_GET({ email }) {
    return ({ token = undefined, ...etc } = {}) => request.GET_withAuth(
      {
        form: false,
        url: this.url + `/recoveryCode/${email}`,
        wrap: token === undefined ? {} : { token },
      },
    )({ token: settings.adminToken, ...etc });
  },

  newResetCode_POST({ email }) {
    return (etc) => request.post(
      {
        url: this.url + '/newRecoveryCode',
        body: {
          email,
        },
        wrap: etc,
      },
    );
  },
};
