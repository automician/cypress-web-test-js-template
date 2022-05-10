import { UserInfo } from '../data';
import {
  Then, ThenWith, With, Etc,
} from '../../../../subject';
import { RESTful } from '../../../../api/restful.resource';
import { request } from '../../../../api/request';

const _registration = {
  ...RESTful.Resource({ name: 'registration' }),

  /** @param {UserInfo} options */
  start_POST({
    lastName,
    firstName,
    phone,
    email,
    password,
    language,
  }) {
    return request.POST(
      {
        url: `${this.url}/start`,
        body_data_attributes: {
          lastName,
          firstName,
          phone,
          email,
          password,
          language: language,
          confirmPassword: password,
        },
      },
    );
  },
};

const _registrationContinue = {
  ...RESTful.Resource({ base: _registration, name: 'continue' }),

  /** @param {Etc} subject */
  step_codeVerification_POST({ code, token, ...etc }) {
    return request.postWithAuth({
      token,
      wrap: etc,
      url: this.url,
      body_data_attributes: {
        step: 'code-verification',
        code: '' + code,
      },
    });
  },

  /** 
   * @param {UserInfo} options 
   * @returns {(subj: Etc) => ThenWith<{response, token}>}
   */
  step_profile_POST({
    company,
    jobTitle,
    street,
    country,
    state,
    city,
    zipCode,
  }) {
    return ({ token, ...etc }) => request.postWithAuth({
      token,
      wrap: etc,

      url: this.url,
      body_data_attributes: {
        step: 'profile',
        company,
        jobTitle,
        address: {
          street,
          country,
          state,
          city,
          zipCode,
        },
      },
    });
    /* JUST another style: (TODO: probably, choose one style and follow it)
      return ({ token, ...etc }) => request.POST_WithAuth({
        url: this.url,
        body_data_attributes: {
          step: 'profile',
          company,
          jobTitle,
          address: {
            street,
            country,
            state,
            city,
            zipCode,
          },
        },
      })({ token, ...etc });
       */
  },
};

export const registration = {
  ..._registration,
  continue: _registrationContinue,
};
