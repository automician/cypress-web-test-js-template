/* eslint-disable consistent-return */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import {
  subject, then, Then, ThenWith, With, Etc, Fluent, Step,
} from '../../../subject';
import { settings } from '../../../project.settings';
import {
  Admin, Language, Country,
  User, UserInfo, Post,
} from './data';
import { response } from '../../../api/response';
import { registration } from './resources/registration.resource';
import { auth } from './resources/auth.resource';
import { posts } from './resources/post.resource';
import { account } from './resources/account.resource';

export const api = /* step( */{ // TODO: @yashaka: uncomment steps once fixed for higher oder functions
  toString() { return 'API'; },
  url() { return settings.apiUrl; },

  then,
  response,
  get fluent() { return Fluent(this) }, 
  get _STEP() { return Step(this) }, 

  wrap(subject) {
    return cy.wrap(subject, {log: false});
  },

  log(message) {
    return this._STEP(message)();
  },

  GIVEN(callback) { return this._STEP('GIVEN')(callback); },
  WHEN(callback) { return this._STEP('WHEN')(callback); },
  THEN(callback) { return this._STEP('THEN')(callback); },
  EXPECT(callback) { return this._STEP('EXPECT')(callback); },
  AND(callback) { return this._STEP('AND')(callback); },

  /* * * * * * * * * * *
   * * * RESOURCES * * *
   * * * * * * * * * * */

  registration,
  auth,
  posts,
  account,

  /* * * * * * * * * * *
   * * * * STEPS * * * *
   * * * * * * * * * * */

  /**
   * @param {User} user
   * @returns {({token, ...etc}: Etc) => ThenWith<{ code: string }>}
   */
  getCode(user) {
    return ({ token, ...etc }) => user.phone === Admin.phone ?
        cy.wrap({ code: Admin.code, token, ...etc })
        :
        this.account.getPhoneCode_GET(user)({ token, ...etc })
          .then(response.should.haveStatusOK)
          .then(response.getData0AttributesCode);
  },

  /** @param {User} user */
  register(user) {
    api.then(api.registration.start_POST(user))
      .then(response.should.haveStatusOK)
      .then(response.getIncluded0AttributesToken)
      .then(api.getCode(user))
      .then(api.registration.continue.step_codeVerification_POST)
      .then(response.should.haveStatusOK)
      .then(api.registration.continue.step_profile_POST(user))
      .then(response.should.haveStatusOK)
      .then(subject.save);
    return this;
  },

  login(user) {
    api.then(api.auth.signin_POST(user))
      .then(response.should.haveStatusOK)
      .then(response.getToken)
      .then(subject.save);
    return this;
  },

  /**
   * Creates post and saves { id, post: { id }, response } to subject
   * @param {Post} post 
   */
  createPost(post) {
    api.then(api.posts.POST(post))
      .then(response.should.haveStatusOK)
      .then(response.getData0Id)
      .then(({ id, ...rest }) => ({ id, post: { id }, ...rest }))
      .then(subject.save);
    return this;
  },

  /**
   * @param {Post} post
   * @returns {({token, ...etc}: Etc) => ThenWith<{ id, post: { id }, response }>}
   */
  createPostStep(post) {
    return ({ token, ...etc }) => api.posts.POST(post)({ token, ...etc })
      .then(response.should.haveStatusOK)
      .then(response.getData0Id)
      .then(({ id, ...rest }) => ({ id, post: { id }, ...rest }))
      .then(subject.log);
  },

  /** @param {Post} post*/
  updatePost(post) {
    return this.fluent(this.posts.PUT(post, response.should.haveStatusOK));
  },

  /** @param {Post} post*/
  updatePostStep(post) {
    /** @type {(subj: Etc) => ThenWith<{response}>} */
    return ({ id, token, ...etc }) => this.posts.PUT(post)(
      { id, token, ...etc }
    )
      .then(response.should.haveStatusOK);
  },

  deletePost() {
    return api.fluent(
      ({ post: { id: postId }, id, ...etc }) => api.posts.DELETE(
        { id: postId ?? id, ...etc }, // there will be no `post: {id}` from now
        response.should.haveStatusNoContent,
      ),
    );
  },

  /** @param {Etc} _ */
  deletePostStep({ post: { id: postId }, id, ...etc }) {
    return api.posts.DELETE(
      { id: postId ?? id, ...etc },
      response.should.haveStatusNoContent,
    );
  },
};
