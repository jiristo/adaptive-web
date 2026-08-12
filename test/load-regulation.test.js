import assert from 'node:assert/strict';
import test from 'node:test';
import { actionLabels, buildPlan, describeChange, formatTime, protocols } from '../src/lib/load-regulation.js';

test('každá potřeba má krátký a úplný protokol', () => {
  assert.deepEqual(Object.keys(protocols).sort(), ['exhausted', 'priorities', 'tension', 'thoughts']);
  for (const protocol of Object.values(protocols)) {
    assert.equal(protocol.duration, 90);
    assert.equal(protocol.steps.length, 3);
    assert.ok(protocol.title.length > 0);
  }
});

test('časovač formátuje hraniční hodnoty', () => {
  assert.equal(formatTime(90), '1:30');
  assert.equal(formatTime(60), '1:00');
  assert.equal(formatTime(0), '0:00');
  assert.equal(formatTime(-10), '0:00');
});

test('změna zátěže není nikdy interpretována jako diagnóza nebo selhání', () => {
  assert.match(describeChange(8, 5), /snížila/);
  assert.match(describeChange(5, 7), /Není to selhání/);
  assert.match(describeChange(5, 5), /Není to selhání/);
});

test('plán normalizuje čísla a ořízne volný text', () => {
  const plan = buildPlan({ before: '8', after: '6', action: 'finish', detail: '  Jeden e-mail  ' });
  assert.equal(plan.before, 8);
  assert.equal(plan.after, 6);
  assert.equal(plan.actionLabel, actionLabels.finish);
  assert.equal(plan.detail, 'Jeden e-mail');
});

