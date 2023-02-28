import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getResults} from "../store/actions/testAction";
import Message from "./Message";
import Loader from "./Loader";

const Results = () => {
  const {loading, error, results} = useSelector(state => state.allResults)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getResults())
  }, [dispatch])

  return (
    <div>

      {loading ? <Loader/> : error ? <Message>{error.message}</Message> : (
        <div>
          <div>
            <span>Название поста</span>
            <span>Кол-во баллов</span>
          </div>
          {results !== null && results.length !== 0 ? results.map((result) => {
            return (
              <div key={result.id}>
                <span>{result.title}:</span>
                <span>{result.totalScore}</span>
              </div>
            )
          }) : <></>
          }
        </div>
      )}
    </div>

  );
}

export default Results;