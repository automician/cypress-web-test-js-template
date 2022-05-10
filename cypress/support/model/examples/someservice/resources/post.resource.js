import {
  Post
} from '../data';
import {
  Then, ThenWith, With, Etc,
} from '../../../../subject';
import { RESTful } from '../../../../api/restful.resource';
import { request } from '../../../../api/request';

export const posts = {
  ...RESTful.Resource({ name: 'posts' }),
  ...RESTful.withAuth.by_id.GET,
  ...RESTful.withAuth.by_id.DELETE,

  /**
   * Returns «Create post authenticated POST request callback»
   * @param {Post} data
   */
  POST({
    title,
    description,
  }) {
    return ({ token, ...etc }) => request.POST_withAuth({
      url: this.url,
      body_data_attributes: {
        title,
        description,
      },
    })({ token, ...etc });
  },

  /**
   * Rturns «Update post authenticated PUT request callback»
   * @param {Post} _
   */
  PUT({
    title,
    description,
  }, ...callbacks) {
    return ({ id, token, ...etc }) => request.putWithAuth({
      url: `${this.url}/${id}`,
      body_data_attributes: {
        title,
        description,
      },
      token,
      wrap: { id, ...etc },
    }, ...callbacks);
  },
};
