const GROUP_ID_REGEX =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export function getGroupId(event) {
  const params = event['queryStringParameters'];
  const groupId = params ? params['groupId'] : undefined;

  const regex = new RegExp(GROUP_ID_REGEX);
  return regex.test(groupId) ? groupId : undefined;
}

export function getPlayerName(event) {
  const params = event['queryStringParameters'];
  return params ? params['playerName'] : undefined;
}

export function getPlayer(event) {
  return event && event.body && JSON.parse(event.body);
}
