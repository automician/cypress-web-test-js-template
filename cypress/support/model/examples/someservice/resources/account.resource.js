import {
  Etc,
} from '../../../../subject';
import { RESTful } from '../../../../api/restful.resource';
import { request } from '../../../../api/request';

export const account = {
  ...RESTful.Resource({ name: 'account' }),


  /** @param {Etc} etc */
  provile_GET(etc) {
    return request.GET_withAuth(
      {
        url: `${this.url}/profile`,
      },
    )(etc);
  },

  /**
   * @param {{ email: string }} _
   */
  getPhoneCode_GET({ email }) {
    return request.GET_withAuth({
      form: false,
      url: `${this.url}/getPhoneCode/${email}`,
    });
  },
};
