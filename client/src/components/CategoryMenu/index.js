// import react dependencies
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// import apollo dependency
import { useQuery } from '@apollo/client';

// import utils dependencies
import { UPDATE_CATEGORIES, UPDATE_CURRENT_CATEGORY } from '../../utils/actions';
import { QUERY_CATEGORIES } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';

function CategoryMenu() {
  const dispatch = useDispatch();
  const state = useSelector(state => state);
  const { categories } = state;
  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

  // if categoryData, loading, or dispatch is updated, update category
  useEffect(() => {
    // retrieved from server
    if (categoryData) {
      dispatch({
        type: UPDATE_CATEGORIES,
        categories: categoryData.categories,
      });
      categoryData.categories.forEach((category) => {
        idbPromise('categories', 'put', category);
      });
    } 
    // get cache from idb
    else if (!loading) {
      idbPromise('categories', 'get').then((categories) => {
        dispatch({
          type: UPDATE_CATEGORIES,
          categories: categories,
        });
      });
    }
  }, [categoryData, loading, dispatch]);

  // update current category when button is clicked
  const handleClick = (id) => {
    dispatch({
      type: UPDATE_CURRENT_CATEGORY,
      currentCategory: id,
    });
  };

  return (
    //mt-24 moved my title more down to where I like it ;)
    <div className="mt-24">
    <h2 className="text-2xl font-bold mb-4">Choose a Category:</h2>
    {categories.map((item) => (
      <button
        key={item._id}
        onClick={() => {
          handleClick(item._id);
        }}
        className="bg-gray-200 hover:bg-gray-300 rounded-full py-2 px-4 text-sm font-medium text-gray-700 mr-4 mb-4"
      >
        {item.name}
      </button>
    ))}
  </div>
  
  );
}

export default CategoryMenu;