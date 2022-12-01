import diff from 'microdiff';

// https://github.com/flitbit/diff#differences
const dictionary = {
  CHANGE: {
    color: '#2196F3',
    text: 'CHANGED:',
  },
  CREATE: {
    color: '#4CAF50',
    text: 'ADDED:',
  },
  REMOVE: {
    color: '#F44336',
    text: 'DELETED:',
  },
};

export function style(type) {
  return `color: ${dictionary[type].color}; font-weight: bold`;
}

export function render(difference) {
  const { type, path } = difference;

  switch (type) {
    case 'CHANGE':
      return [path.join('.'), difference.oldValue, '→', difference.value];
    case 'CREATE':
      return [path.join('.'), difference.value];
    case 'REMOVE':
      return [path.join('.'), difference.oldValue];
    default:
      return [];
  }
}

export default function diffLogger(prevState, newState, logger, isCollapsed) {
  try {
    if (isCollapsed) {
      logger.groupCollapsed('diff');
    } else {
      logger.group('diff');
    }
  } catch (e) {
    logger.log('diff');
  }

  const differences = diff(prevState, newState);

  if (differences) {
    differences.forEach((difference) => {
      const output = render(difference);
      const { type } = difference;
      logger.log(`%c ${dictionary[type].text}`, style(type), ...output);
    });
  } else {
    logger.log('—— no diff ——');
  }

  try {
    logger.groupEnd();
  } catch (e) {
    logger.log('—— diff end —— ');
  }
}
