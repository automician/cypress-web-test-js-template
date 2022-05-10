import { request } from './request';
import {
  Etc,
} from '../subject';
import { settings } from '../project.settings';

export const RESTful = {
  Resource: ({ name, base = undefined, url = undefined }) => ({
    toString() { return (base?.toString() ?? 'api') + `.${name}`; },
    url: url ?? ((base?.url ?? settings.apiUrl) + `/${name}`),
  }),

  GET: {

    /**
     * Creates a standard RESTful GET request callback
     * @param {Etc} etc
     */
    GET(etc, ...callbacks) {
      return request.GET_withAuth({
        url: this.url,
      }, ...callbacks)(etc);
    },
  },
  by_id: {
    GET: {
      /**
       * Creates a standard RESTful GET by id request callback
       * @param {Etc} _
       */
      GET({ id, ...etc }, ...callbacks) {
        return request.GET({
          url: `${this.url}/${id}`,
          wrap: { id },
        }, ...callbacks)(etc);
      },
    },
  },

  withAuth: {
    GET: {
      /**
       * Creates a standard RESTful GET authenticated request callback
       * @param {Etc} etc
       */
      GET(etc, ...callbacks) {
        return request.GET_withAuth({
          url: this.url,
        }, ...callbacks)(etc);
      },
    },

    by_id: {
      GET: {

        /**
         * Creates a standard RESTful GET by id authenticated request callback
         * @param {Etc} _
         */
        GET({ id, ...etc }, ...callbacks) {
          return request.GET_withAuth({
            url: `${this.url}/${id}`,
            wrap: { id },
          }, ...callbacks)(etc);
        },
      },

      DELETE: {
        /**
         * Creates a standard RESTful DELETE authenticated request callback
         * @param {Etc} _
         */
        DELETE({ id, token, ...etc }, ...callbacks) {
          return request.DELETE_withAuth({
            url: `${this.url}/${id}`,
          }, ...callbacks)({ token, ...etc }); // there will be no id in chain after deletion
        },
      },

    },
  },
};
