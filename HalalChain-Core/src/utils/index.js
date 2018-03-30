import _ from 'lodash';
import configs from '../configs';
import Storage from './Storage';
import userType from '../configs/userType';
import userStatus from '../configs/userStatus';
import imageSize from '../configs/imageSize';

export function updateItem(arr, item) {
  const index = _.indexOf(arr, arr.find(x => x.id === item.id));
  arr.splice(index, 1, item);
  return arr;
}

export function removeItem(arr, id) {
  let ids = [];
  if (!_.isArray(id)) {
    ids.push(id);
  } else {
    ids = id;
  }
  ids.forEach(Id => {
    const index = _.indexOf(arr, arr.find(x => x.id === Id));
    arr.splice(index, 1);
  });
  return arr;
}

export function addItem(arr, item) {
  arr.push(item);
  return arr;
}

export function copyItems(item, count, decorateItem) {
  const arr = [];
  let i = 0;
  while (i < count) {
    arr.push(decorateItem ? decorateItem(item, i) : item);
    i++;
  }
  return arr;
}

export function formatUrl(path) {
  return `${configs.secureHttps ? 'https://' : 'http://'}${configs.host}:${configs.port}${configs.apiRoot}${path[0] !== '/' ? `/${path}` : path}`;
}

export const getUserToken = () => Storage.get(configs.authToken).token;

export const getImagesJson = url => {
  return url ? JSON.stringify(url.split(',')) : '[]';
};

function getJoinUrl(url, index, size) {
  return `${url.substring(0, index)}.${size}${url.substring(index)}`;
}

export function getImageSizeUrl(url, size) {
  const dotIndex = url.lastIndexOf('.');
  switch (size) {
    case imageSize.SOURCE:
      return url;
    case imageSize.THUMBNAIL:
    case imageSize.MIN:
    case imageSize.MAX:
    case imageSize.MID:
      return getJoinUrl(url, dotIndex, size);
    default:
      return url;
  }
}


export const getUploadDefaultList = url => {
  const images = JSON.parse(url);
  return images.map((image, index) => {
    return {
      uid: -(index + 1),
      name: image,
      status: 'done',
      url: image,
      thumbUrl: image
    };
  });
};

export const getExtInfoDefaultValue = (extInfo, key) => {
  if (extInfo) {
    const item = JSON.parse(extInfo).find(x => x.key === key);
    return item ? item.value : '';
  }
  return '';
};

export function getPath(path) {
  return `${configs.staticPrefix}${path}`;
}

export function getDefaultImageUrl() {
  return `${configs.staticPrefix}/img/default.png`;
}

export function getImagePath(path, size) {
  const images = path ? JSON.parse(path) : [];
  let url = '';
  if (images.length > 0) {
    url = getImageSizeUrl(images[0], size);
  } else {
    url = getDefaultImageUrl();
  }
  return url;
}

export function getFocusImage(imageUrls) {
  if (imageUrls && imageUrls !== 'string') {
    const urls = JSON.parse(imageUrls);
    if (urls.length > 0) {
      return urls[0];
    }
    return getDefaultImageUrl();
  }
  return getDefaultImageUrl();
}

export function isApproved(user) {
  return user && user.userStatus === userStatus.SUCCESS;
}

export function isMerchant(user) {
  return user && user.userType === userType.MERCHANT;
}

export function isFactory(user) {
  return user && user.userType === userType.FACTORY;
}

export function isApprovedMerchant(user) {
  return isMerchant(user) && isApproved(user);
}

export function isApprovedFactory(user) {
  return isFactory(user) && isApproved(user);
}

export function urlToUploadList(url) {
  if (url) {
    return [{
      url,
      uid: url,
      name: url,
      status: 'done'
    }];
  }
  return [];
}