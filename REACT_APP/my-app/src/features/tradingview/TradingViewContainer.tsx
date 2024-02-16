import React, { useEffect } from 'react';
import { useAppDispatch } from '../../app/hooks';
import {
  createSeries,
  modifySeries,
  symbolResolved,
  timescaleUpdate, duMessage
} from './chartSlice';

import { formatCurrentTimeHMS } from '../../utils/common';

import ChartsInfoContainer from './ChartsInfoContainer';

export default function TradingviewContainer() {
  const dispatch = useAppDispatch();

  console.log(">>> LOADED TradingviewContainer");

  useEffect(() => {
    function handleMessageFromDOM(message?: any, isSend?: boolean) {
      const _handleIncomingMessages = (value: string, index: any) => {//_handleIncomingMessages
        try {
          let item = JSON.parse(value);
          let m = item.m;

          if (m) {
            let chart_ID = item.p[0];

            let p1 = item.p[1];
            let sds_1 = p1['sds_1'];
            switch (m) {
              case "timescale_update":
                dispatch(timescaleUpdate(item));
                break;
              case "series_completed":
                let rt_update_period = item.p[4]['rt_update_period'];
                console.log('%c >>> series_completed : ', 'background: orange; color: black', timeNow, { item, rt_update_period });
                break;
              case "quote_completed":
                let ticker = item.p[1];
                console.debug(timeNow, ">>> quote_completed > ", { ticker, item });
                break;

              case "symbol_resolved":
                console.log('%c >>> symbol_resolved : ', 'background: green; color: white', timeNow, { chart_ID, item });
                dispatch(symbolResolved(item));
                break;
              case "du":
                dispatch(duMessage(item));
                break;
              default:
                // console.debug(timeNow, "xxx_not_handled: ", { m, item }); 
                break;
            }
          }
          else {
            console.log('%c XXXX no m prop: ', 'background: blue; color: #bada55', timeNow, { item });
          }

        } catch (error) {
          console.error(timeNow, "in filteredArray.forEach(myFunction) error: ", { error, value });
          alert(error);
        }

      };//_handleIncomingMessages

      const _handleOutgoingMessages = (value: string) => {//_handleOutgoingMessages
        try {
          if (value.includes('{') && value.includes(':')) {
            let item = JSON.parse(value);
            let m = item.m;
            if (m) {
              // console.log("_handleOutgoingMessages, message->item: ", { item, m });
              switch (m) {
                case "modify_series":
                  console.log('%c OUTGOING >>> modify_series : ', 'background: #1a94ff; color: black', timeNow, { item });
                  dispatch(modifySeries(item));
                  break;
                case "create_series":
                  console.log('%c OUTGOING >>> create_series : ', 'background: #1a94ff; color: black', timeNow, { item });
                  dispatch(createSeries(item));
                  break;
                default:
                  // console.debug(timeNow, "OUTGOING xxx_not_handled: ", { m, item });
                  break;
              }
            } else {
              console.debug("_handleOutgoingMessages, message->item: NO M", { item });
            }
          }
          else {
            // console.debug("~ message, IGNORE xxx_not_handled ?, ", { value });
            return null;
          }

        } catch (error) {
          console.error("error _handleOutgoingMessages, ", { error, value });
        }

      };//_handleOutgoingMessages

      try {
        var timeNow = formatCurrentTimeHMS();
        if (isSend) {
          _handleOutgoingMessages(message)
        } else {
          // let message = data.message;
          let resultArray = message.split(/~m~/);
          let filteredArray = resultArray.filter((value: string | string[] | undefined) => value !== undefined && value !== '' && (value.includes('{') || value.includes(':')));

          // console.log({ filteredArray, resultArray });

          filteredArray.forEach(_handleIncomingMessages);
        }

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
          let isSend = event.data.message.isSend;

          if (isSend) {
            handleMessageFromDOM(message, true);
          } else {
            handleMessageFromDOM(message, false);
          }
        }
      } catch (error) {
        console.error("handleMessage, error:", error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  });

  return (
    <div style={{margin:"10px 10px"}}>
      HELLO YOU TRADINGVIEW Container

      <ChartsInfoContainer />

    </div>
  );
}


