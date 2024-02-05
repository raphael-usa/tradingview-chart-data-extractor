import React, { useState, useEffect } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  incrementIfOdd,
  selectCount,
} from './counterSlice';
import styles from './Counter.module.css';

function padZero(number: number) {
  return number < 10 ? `0${number}` : number;
}

function formatCurrentTimeHMS() {
  const now = new Date();

  // Extracting components of the time
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // Formatting the time into "hour:min:sec" format
  const formattedTime = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;

  return formattedTime;
}

export function Counter() {
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();
  const [incrementAmount, setIncrementAmount] = useState('2');

  const incrementValue = Number(incrementAmount) || 0;

  console.log(">>> LOADED COUNTER");

  function handleMessageFromDOM(message?: any) {
    const _myFunction = (value: string, index: any) => {
      try {
        let item = JSON.parse(value);
        let m = item.m;

        if (m) {
          let chart_ID = item.p[0];

          let p1 = item.p[1];
          let sds_1 = p1['sds_1'];
          switch (m) {
            case "timescale_update":
              if (sds_1) {
                console.log('%c >>> symbol_resolved : ', 'background: yellow; color: #bada55', timeNow, "YES-sds_1", { chart_ID, item });
              }
              else {
                console.log('%c >>> symbol_resolved : ', 'background: yellow; color: #bada55', timeNow, "NO-sds_1", { chart_ID, item });
              }
              break;
            case "series_completed":
              console.log('%c >>> symbol_resolved : ', 'background: pink; color: #bada55', timeNow, { item });
              break;
            case "quote_completed":
              let ticker = item.p[1];
              console.log(timeNow, ">>> quote_completed > ", { ticker, item });
              break;

            case "symbol_resolved":
              console.log('%c >>> symbol_resolved : ', 'background: green; color: #bada55', timeNow, { chart_ID, item });
              break;
            case "du":
              if (sds_1) {
                let test = sds_1['s'][0]['v'];
                console.log(timeNow, ">>> DUUUU > ", { p1, item, test });
              }
              else {
                console.log(timeNow, ">>> DU OTHER > ", { p1, item });
              }

              break;
            default:
              console.log(timeNow, "xxx not handled: ", { m, item });
          }
        }
        else {
          console.log('%c XXXX no m prop: ', 'background: blue; color: #bada55', timeNow, { item });
        }

      } catch (error) {
        console.error(timeNow, "in filteredArray.forEach(myFunction) error: ", { error, value });
        alert(error);
      }

    };
    try {
      // let message = data.message;
      let resultArray = message.split(/~m~/);
      let filteredArray = resultArray.filter((value: string | string[] | undefined) => value !== undefined && value !== '' && (value.includes('{') || value.includes(':')));

      // console.log({ filteredArray, resultArray });

      var timeNow = formatCurrentTimeHMS();

      filteredArray.forEach(_myFunction);


    } catch (error) {
      console.error("handleMessageFromDOM error: ", { error, message });
      alert(error);
    }


    // console.log('Message received from DOM:', message);

    // Perform actions based on the message
  }

  const handleMessage = (event?: any) => {
    try {
      // Ensure the message is from a trusted source (e.g., check event.origin)
      if (event.source === window && event.data.type === "LOCALHOST_CS_TO_LOCALHOST_DOM") {
        let message = event.data.message.data;
        handleMessageFromDOM(message);
        // console.log(">>> Counter.tsx, event: ", { message });
      }
    } catch (error) {
      console.error("handleMessage, error:", error);
    }
  };

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    // window.addEventListener('message', (event) => {
    //   // Ensure the message is from a trusted source (e.g., check event.origin)
    //   if (event.source === window && event.data) {
    //     console.log(">>> Counter.tsx, event: ", { event });
    //   }


    // });

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);


  return (
    <div>
      HELLO YOU!
      <div className={styles.row}>
        <button
          className={styles.button}
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          -
        </button>
        <span className={styles.value}>{count}</span>
        <button
          className={styles.button}
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          +
        </button>
      </div>
      <div className={styles.row}>
        <input
          className={styles.textbox}
          aria-label="Set increment amount"
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(e.target.value)}
        />
        <button
          className={styles.button}
          onClick={() => dispatch(incrementByAmount(incrementValue))}
        >
          Add Amount
        </button>
        <button
          className={styles.asyncButton}
          onClick={() => dispatch(incrementAsync(incrementValue))}
        >
          Add Async
        </button>
        <button
          className={styles.button}
          onClick={() => dispatch(incrementIfOdd(incrementValue))}
        >
          Add If Odd
        </button>
      </div>
    </div>
  );
}
