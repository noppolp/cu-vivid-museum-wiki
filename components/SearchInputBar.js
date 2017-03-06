// @flow
import React from 'react';
import { Form, Label } from 'semantic-ui-react';
import { compose, withReducer, lifecycle } from 'recompose';
import Router from 'next/router';
import gql from 'graphql-tag';
import queryString from 'query-string';

const CHECKED = 'input/CHECKED';
const CHECKED_ALL = 'input/CHECKED_ALL';

const Component = ({ categories, dispatch, state, onTextChange, onCategoryChange }) => (
  <Form onSubmit={e => e.preventDefault()} >
    <Form.Input name="text" action={{ icon: 'search' }} placeholder="Search..." />
    <Form.Group inline id="size">
      { categories ? categories.map(
                category => (
                  <Form.Checkbox
                    key={category._id}
                    label={category.name}
                    checked={state[category._id]}
                    onChange={(e, checked) => dispatch({ type: CHECKED, payload: { key: category._id, value: checked } })}
                  />
                ),
            ) : null }
      <Label onClick={() => dispatch({ type: CHECKED_ALL })} >{'Select all'}</Label>
    </Form.Group>
    <style jsx>{` .select-all {
                        font-size: 14px;
                        cursor: pointer;
                    }
                    .category-wrap {
                        padding: 5px 15px;
                        border-radius: 5px;
                        background: rgba(0, 0, 0, 0.3);
                        display: flex;
                        font-size: 20px;
                        color: white;
                        align-items: center;
                    }
                    .fa {
                        margin-right: 4px;
                    }
                    .category-item {
                        margin-right: 15px;
                        cursor: pointer;
                    }
                    .category-item:nth-last-child(1) {
                        margin:0;
                    }`}
    </style>
  </Form>
);


const categoriesSelectorReducer = (state, { type, payload }) => {
  const nextState = Object.assign(state, {});
  switch (type) {
    case CHECKED:
      nextState[payload.key] = payload.value;
      break;
    case CHECKED_ALL:
      Object.keys(nextState).forEach((id) => {
        nextState[id] = true;
      });
      break;
    default:
      break;
  }

  console.log(nextState);
  const { query, pathname } = Router.router;
  // query.categories = Object.keys(nextState).map(key => nextState[key]._id);
  // console.log(query);
  // Router.replace(`${pathname}?${queryString.stringify(query)}`);
  return nextState;
};

const SearchInputBar = compose(
        withReducer('state', 'dispatch', categoriesSelectorReducer, ({ categories }) => {
          const initState = {};
          categories.forEach((category) => {
            const { query } = Router.router;
            if (query.categories) {
              const selectedCategories = query.categories.split(',');
              if (selectedCategories.indexOf(category._id) > -1) {
                initState[category._id] = true;
              } else {
                initState[category._id] = false;
              }
            }
          });
          return initState;
        }),
)(Component);

SearchInputBar.fragments = {
  categories: gql`
        fragment SearchInputBar on Category {
            _id
            name
            key
            thumbnailImage {
                secure_url
            }
        }
    `,
};

export default SearchInputBar;
