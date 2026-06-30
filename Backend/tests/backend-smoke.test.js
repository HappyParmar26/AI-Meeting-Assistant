const test = require('node:test');
const assert = require('node:assert/strict');

test('meeting router can be required without crashing', () => {
  assert.doesNotThrow(() => require('../src/routes/meetingRouter'));
});

test('meeting model supports the fields used by meeting creation flow', () => {
  const Meeting = require('../src/models/meeting.model');
  const meeting = new Meeting({
    title: 'Sprint Planning',
    owner: '507f191e810c19729de860ea',
    participants: ['507f191e810c19729de860eb'],
    meetingCode: 'ABC123',
    status: 'scheduled',
    startedAt: new Date('2026-06-30T10:00:00.000Z'),
    endedAt: new Date('2026-06-30T10:30:00.000Z'),
  });

  assert.equal(meeting.title, 'Sprint Planning');
  assert.equal(meeting.owner?.toString(), '507f191e810c19729de860ea');
  assert.equal(meeting.participants?.length, 1);
  assert.equal(meeting.meetingCode, 'ABC123');
  assert.equal(meeting.startedAt instanceof Date, true);
  assert.equal(meeting.endedAt instanceof Date, true);
});

test('notification model stores assignment metadata for action items', () => {
  const Notification = require('../src/models/notification.model');
  const notification = new Notification({
    userId: '507f191e810c19729de860ec',
    meetingId: '507f191e810c19729de860ed',
    type: 'action-item',
    actionItemId: '507f191e810c19729de860ee',
    message: 'Please complete the onboarding checklist',
    status: 'unread',
  });

  assert.equal(notification.type, 'action-item');
  assert.equal(notification.status, 'unread');
  assert.equal(notification.message, 'Please complete the onboarding checklist');
});
