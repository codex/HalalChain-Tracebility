import _ from 'lodash';

export const getSeniorCategories = (categories) => _.uniq(categories.map(x => x.seniorClass));

export const getMidCategories = (categories, senior) => _.uniq(categories
  .filter(x => x.seniorClass === senior)
  .map(x => x.midClass));

export const getJuniorCategories = (categories, senior, mid) =>
  categories.filter(x => x.seniorClass === senior && x.midClass === mid)
    .map(x => {
      return {juniorClass: x.juniorClass, cid: x.cid};
    });
