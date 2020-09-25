/**
 * @license
 * Copyright (C) 2016 The Android Open Source Project
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
import './gr-button.js';
import {addListener} from '@polymer/polymer/lib/utils/gestures.js';
import {appContext} from '../../../services/app-context.js';
import {html} from '@polymer/polymer/lib/utils/html-tag.js';

const basicFixture = fixtureFromElement('gr-button');

const nestedFixture = fixtureFromTemplate(html`
<div id="test">
  <gr-button class="testBtn"></gr-button>
</div>
`);

const tabindexFixture = fixtureFromTemplate(html`
  <gr-button tabindex="3"></gr-button>
`);

suite('gr-button tests', () => {
  let element;

  const addSpyOn = function(eventName) {
    const spy = sinon.spy();
    if (eventName == 'tap') {
      addListener(element, eventName, spy);
    } else {
      element.addEventListener(eventName, spy);
    }
    return spy;
  };

  setup(() => {
    element = basicFixture.instantiate();
  });

  test('disabled is set by disabled', () => {
    const paperBtn = element.shadowRoot.querySelector('paper-button');
    assert.isFalse(paperBtn.disabled);
    element.disabled = true;
    assert.isTrue(paperBtn.disabled);
    element.disabled = false;
    assert.isFalse(paperBtn.disabled);
  });

  test('loading set from listener', () => {
    let resolve;
    element.addEventListener('click', e => {
      e.target.loading = true;
      resolve = () => e.target.loading = false;
    });
    const paperBtn = element.shadowRoot.querySelector('paper-button');
    assert.isFalse(paperBtn.disabled);
    MockInteractions.tap(element);
    assert.isTrue(paperBtn.disabled);
    assert.isTrue(element.hasAttribute('loading'));
    resolve();
    flush();
    assert.isFalse(paperBtn.disabled);
    assert.isFalse(element.hasAttribute('loading'));
  });

  test('tabindex should be -1 if disabled', () => {
    element.disabled = true;
    assert.isTrue(element.getAttribute('tabindex') === '-1');
  });

  // Regression tests for Issue: 11969
  test('tabindex should be reset to 0 if enabled', () => {
    element.disabled = false;
    assert.equal(element.getAttribute('tabindex'), '0');
    element.disabled = true;
    assert.equal(element.getAttribute('tabindex'), '-1');
    element.disabled = false;
    assert.equal(element.getAttribute('tabindex'), '0');
  });

  test('tabindex should be preserved', () => {
    element = tabindexFixture.instantiate();
    element.disabled = false;
    assert.equal(element.getAttribute('tabindex'), '3');
    element.disabled = true;
    assert.equal(element.getAttribute('tabindex'), '-1');
    element.disabled = false;
    assert.equal(element.getAttribute('tabindex'), '3');
  });

  // 'tap' event is tested so we don't loose backward compatibility with older
  // plugins who didn't move to on-click which is faster and well supported.
  test('dispatches click event', () => {
    const spy = addSpyOn('click');
    MockInteractions.click(element);
    assert.isTrue(spy.calledOnce);
  });

  test('dispatches tap event', () => {
    const spy = addSpyOn('tap');
    MockInteractions.tap(element);
    assert.isTrue(spy.calledOnce);
  });

  test('dispatches click from tap event', () => {
    const spy = addSpyOn('click');
    MockInteractions.tap(element);
    assert.isTrue(spy.calledOnce);
  });

  // Keycodes: 32 for Space, 13 for Enter.
  for (const key of [32, 13]) {
    test('dispatches click event on keycode ' + key, () => {
      const tapSpy = sinon.spy();
      element.addEventListener('click', tapSpy);
      MockInteractions.pressAndReleaseKeyOn(element, key);
      assert.isTrue(tapSpy.calledOnce);
    });

    test('dispatches no click event with modifier on keycode ' + key, () => {
      const tapSpy = sinon.spy();
      element.addEventListener('click', tapSpy);
      MockInteractions.pressAndReleaseKeyOn(element, key, 'shift');
      MockInteractions.pressAndReleaseKeyOn(element, key, 'ctrl');
      MockInteractions.pressAndReleaseKeyOn(element, key, 'meta');
      MockInteractions.pressAndReleaseKeyOn(element, key, 'alt');
      assert.isFalse(tapSpy.calledOnce);
    });
  }

  suite('disabled', () => {
    setup(() => {
      element.disabled = true;
    });

    for (const eventName of ['tap', 'click']) {
      test('stops ' + eventName + ' event', () => {
        const spy = addSpyOn(eventName);
        MockInteractions.tap(element);
        assert.isFalse(spy.called);
      });
    }

    // Keycodes: 32 for Space, 13 for Enter.
    for (const key of [32, 13]) {
      test('stops click event on keycode ' + key, () => {
        const tapSpy = sinon.spy();
        element.addEventListener('click', tapSpy);
        MockInteractions.pressAndReleaseKeyOn(element, key);
        assert.isFalse(tapSpy.called);
      });
    }
  });

  suite('reporting', () => {
    let reportStub;
    setup(() => {
      reportStub = sinon.stub(appContext.reportingService,
          'reportInteraction');
      reportStub.reset();
    });

    test('report event after click', () => {
      MockInteractions.click(element);
      assert.isTrue(reportStub.calledOnce);
      assert.equal(reportStub.lastCall.args[0], 'button-click');
      assert.deepEqual(reportStub.lastCall.args[1], {
        path: `html>body>test-fixture#${basicFixture.fixtureId}>gr-button`,
      });
    });

    test('report event after click on nested', () => {
      element = nestedFixture.instantiate();
      MockInteractions.click(element.querySelector('gr-button'));
      assert.isTrue(reportStub.calledOnce);
      assert.equal(reportStub.lastCall.args[0], 'button-click');
      assert.deepEqual(reportStub.lastCall.args[1], {
        path: `html>body>test-fixture#${nestedFixture.fixtureId}` +
            `>div#test>gr-button.testBtn`,
      });
    });
  });
});

