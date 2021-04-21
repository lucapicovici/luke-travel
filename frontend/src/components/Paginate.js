import React from 'react';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useLocation } from 'react-router-dom';

const Paginate = ({ page, pages }) => {
  const location = useLocation();
  const path = location.pathname;
  const baseURL = path.split('/page/')[0] === '/' ? '' : path.split('/page/')[0];

  return pages > 1 && (
    <Pagination className='justify-content-center my-3'>
      <LinkContainer
        key={1}
        to={`${baseURL}/page/${1}`}
      >
        <Pagination.First />
      </LinkContainer>

      {[...Array(pages).keys()].map(p => (
        <LinkContainer 
          key={p+1} 
          to={`${baseURL}/page/${p + 1}`}
        >
          <Pagination.Item active={p+1 === page}>{p+1}</Pagination.Item>
        </LinkContainer>
      ))}

      <LinkContainer
        key={pages}
        to={`${baseURL}/page/${pages}`}
      >
        <Pagination.Last />
      </LinkContainer>
    </Pagination>
  )
}

export default Paginate;