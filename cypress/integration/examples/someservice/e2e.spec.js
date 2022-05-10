import { subject } from '../../../support/subject';
import { api } from '../../../support/model/examples/someservice/api.app';
import {
  post, user
} from '../../../support/model/examples/someservice/data';
import { response } from '../../../support/api/response';

describe('end to end user api scenarios', () => {
  beforeEach(() => { subject.init(); });

  it('New user registers to app [low level style]', () => {
    const newUser = user();

    api.then(api.registration.start_POST(newUser))
      .then(response.should.haveStatusOK)
      .then(response.getIncluded0AttributesToken)
      .then(api.getCode(newUser))
      .then(api.registration.continue.step_codeVerification_POST)
      .then(response.should.haveStatusOK)
      .then(api.registration.continue.step_profile_POST(newUser))
      .then(response.should.haveStatusOK)
      .then(({response, ...etc}) => {
        // TODO: add more assertions
        return api.wrap({response, ...etc})
      })
      .then(api.auth.signin_POST(newUser))
      .then(response.should.haveStatusOK)
      .then(response.getToken)
      .then(({response, ...etc}) => {
        // TODO: add more assertions
        return api.wrap({response, ...etc})
      });
  });

  it('New user registers and creates post [FLUENT high level style]', () => {
    const newUser = user();
    const newPost = post();

    api.register(newUser)
      .login(newUser)
      .createPost(newPost)
      .deletePost();
      // TODO: add final assertions
  });

  it(
    'New user registers and creates post [ GHERKIN with requestSteps Style ]', 
    () => {
    const newUser = user();
    const newPost = post();
    api.GIVEN().register(newUser);


    api.WHEN().login(newUser)
      .AND(api.createPostStep(newPost))
      .THEN(({response, ...etc}) => {
        // TODO: add more assertions
        return api.wrap({response, ...etc})
      })
      .WHEN(api.deletePostStep)
      .THEN(({response, ...etc}) => {
        // TODO: add more assertions
        return api.wrap({response, ...etc})
      });
  });
});
