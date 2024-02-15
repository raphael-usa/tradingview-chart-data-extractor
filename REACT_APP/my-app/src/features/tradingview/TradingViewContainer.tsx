import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  createSeries,
  modifySeries,
  symbolResolved,
  timescaleUpdate, duMessage, stateCharts, stateSymbolInfos
} from './chartSlice';

import { formatCurrentTimeHMS } from '../../utils/common';


export default function TradingviewContainer() {
  const dispatch = useAppDispatch();
  // const charts = useAppSelector(stateCharts);

  console.log(">>> LOADED TradingviewContainer");

  // useEffect(() => {
  //   let chart_names = Object.keys(charts);
  //   if (charts && chart_names.length > 0) {
  //     console.log(">>> useEffect Handling state changes...", { charts, chart_names });
  //     chart_names.forEach(name => {
  //       console.log(name);
  //       let study_keys = Object.keys(charts[name]);
  //       console.log({study_keys});
  //     });
  //   }

  // }, [charts]);

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
                // if (sds_1) {
                //   console.log('%c >>> timescale_update : ', 'background: yellow; color: black', timeNow, "YES-sds_1", { chart_ID, item });
                // }
                // else {
                //   console.log('%c >>> timescale_update non sds_1 : ', 'background: yellow; color: red', timeNow, "NO-sds_1", { chart_ID, item });
                // }
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
                // console.log(timeNow, ">>> DU_MESSAGE > ", { item });

                dispatch(duMessage(item));

                break;
              default:
                console.debug(timeNow, "xxx not handled: ", { m, item });
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
                  console.debug(timeNow, "OUTGOING xxx not handled: ", { m, item });
              }
            } else {
              console.debug("_handleOutgoingMessages, message->item: NO M", { item });
            }
          }
          else {
            console.debug("~ message, IGNORE ?, ", { value });
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
    <div>
      HELLO YOU TRADINGVIEW Container

      <ChartsInfo />

    </div>
  );
}


function ChartsInfo() {
  const charts = useAppSelector(stateCharts);
  const symbolInfos = useAppSelector(stateSymbolInfos);

  interface ChartObj {
    key?: string;
    full_name?: string;
    candleData?: any; // Assuming posts is an array of strings
    duUpdates?: any;
  }
  const [chart_objs, setChart_objs] = useState<ChartObj[]>([]);

  let chart_names = Object.keys(charts);
  let symbolInfos_keys = Object.keys(symbolInfos);
  console.log("ChartsInfo loaded? heres charts useAppSelector: ", { charts, chart_names });

  useEffect(() => {
    try {
      if (charts && chart_names.length > 0 && symbolInfos_keys.length > 0) {
        // console.log(">>> useEffect Handling state changes...", { charts, chart_names });
        let x_array: any = [];
        chart_names.forEach(name => {
          let study_keys = Object.keys(charts[name]);
          console.log({ study_keys });

          if (study_keys && study_keys.length > 0) {
            study_keys.forEach(sds_x => {
              let item = charts[name][sds_x];
              let sx_keys = Object.keys(item);
              console.log({ item, name, sds_x, sx_keys });

              if (sx_keys.length > 0) {
                sx_keys.forEach(sx => {
                  let sx_data = charts[name][sds_x][sx];

                  try {
                    let seriesSymbolInfoName = sx_data.seriesSymbolInfoName_sds_sym_x;
                    let seriesCandleInterval = sx_data.seriesCandleInterval;

                    let sym_data = symbolInfos[seriesSymbolInfoName].data;
                    let full_name = sym_data.full_name

                    let candleData = sx_data.seriesCandleData;
                    let duUpdates = sx_data.duUpdates;

                    let key = `${name}-${sds_x}-${sx}`;
                    let data_obj = { key, full_name, interval: seriesCandleInterval, candleData, duUpdates };
                    x_array.push(data_obj);
                    console.log(`--->>> full_name:${full_name}`, { data_obj });
                    // console.log(`--->>> full_name:${full_name}, interval:${seriesCandleInterval}`, { sx_data, seriesSymbolInfoName, sym_data });
                  } catch (error) {
                    console.warn("ChartsInfo  sx_keys.forEach error", { sx_data, symbolInfos, charts }, error);
                  }

                });
              }

            });

          }
        });
        setChart_objs(x_array)
      }
    } catch (error) {
      console.warn("ChartsInfo error: ", error);
    }
  }, [charts, symbolInfos]);





  return (
    <div>
      <h2>ChartsInfo</h2>
      {chart_objs.length !== 0 && (
        chart_objs.map((chartObj) => (
          <div key={chartObj.key}>
            <h4>Name: {chartObj.full_name}</h4>
            <h4>key: {chartObj.key}</h4>
            <ul style={{textAlign:"left"}}> candleData: array of lists: [[],[], ...]. <br/>
              num of lists: {chartObj.candleData.length}
              {chartObj.candleData.map((post?:any, index?:any) => (
                <li key={index}>length of list: {post.length}  1st item in list: {JSON.stringify(post[0])}</li>
              ))}
              
            </ul>
            {JSON.stringify(chartObj.duUpdates)}
            <hr />
          </div>
        ))
      )}
      {chart_objs.length === 0 && <p>No data available</p>}
    </div>
  );
}