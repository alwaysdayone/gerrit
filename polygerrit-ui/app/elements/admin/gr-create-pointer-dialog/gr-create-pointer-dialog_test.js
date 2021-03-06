/**
 * @license
 * Copyright (C) 2017 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import '../../../test/common-test-setup-karma.js';
import './gr-create-pointer-dialog.js';
import {stubRestApi} from '../../../test/test-utils.js';

const basicFixture = fixtureFromElement('gr-create-pointer-dialog');

suite('gr-create-pointer-dialog tests', () => {
  let element;

  const ironInput = function(element) {
    return element.querySelector('iron-input');
  };

  setup(() => {
    element = basicFixture.instantiate();
  });

  test('branch created', done => {
    stubRestApi('createRepoBranch').returns(Promise.resolve({}));

    assert.isFalse(element.hasNewItemName);

    element._itemName = 'test-branch';
    element.itemDetail = 'branches';

    ironInput(element.$.itemNameSection).bindValue = 'test-branch2';
    ironInput(element.$.itemRevisionSection).bindValue = 'HEAD';

    setTimeout(() => {
      assert.isTrue(element.hasNewItemName);
      assert.equal(element._itemName, 'test-branch2');
      assert.equal(element._itemRevision, 'HEAD');
      done();
    });
  });

  test('tag created', done => {
    stubRestApi('createRepoTag').returns(Promise.resolve({}));

    assert.isFalse(element.hasNewItemName);

    element._itemName = 'test-tag';
    element.itemDetail = 'tags';

    ironInput(element.$.itemNameSection).bindValue = 'test-tag2';
    ironInput(element.$.itemRevisionSection).bindValue = 'HEAD';

    setTimeout(() => {
      assert.isTrue(element.hasNewItemName);
      assert.equal(element._itemName, 'test-tag2');
      assert.equal(element._itemRevision, 'HEAD');
      done();
    });
  });

  test('tag created with annotations', done => {
    stubRestApi('createRepoTag').returns(() => Promise.resolve({}));

    assert.isFalse(element.hasNewItemName);

    element._itemName = 'test-tag';
    element._itemAnnotation = 'test-message';
    element.itemDetail = 'tags';

    ironInput(element.$.itemNameSection).bindValue = 'test-tag2';
    ironInput(element.$.itemAnnotationSection).bindValue = 'test-message2';
    ironInput(element.$.itemRevisionSection).bindValue = 'HEAD';

    setTimeout(() => {
      assert.isTrue(element.hasNewItemName);
      assert.equal(element._itemName, 'test-tag2');
      assert.equal(element._itemAnnotation, 'test-message2');
      assert.equal(element._itemRevision, 'HEAD');
      done();
    });
  });

  test('_computeHideItemClass returns hideItem if type is branches', () => {
    assert.equal(element._computeHideItemClass('branches'), 'hideItem');
  });

  test('_computeHideItemClass returns strings if not branches', () => {
    assert.equal(element._computeHideItemClass('tags'), '');
  });
});

