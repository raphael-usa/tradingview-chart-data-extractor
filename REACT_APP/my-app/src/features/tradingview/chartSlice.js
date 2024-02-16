import { createSlice } from '@reduxjs/toolkit';
// import { RootState } from '../../app/store';
import { formatCurrentTimeHMS } from '../../utils/common';

// import { produce } from 'immer';




const initialState = {
  value: 0,
  status: 'idle',
  charts: {},
  symbolInfo_sds_sym_x: {},
};


export const chartSlice = createSlice({
  name: 'chart',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    createSeries: (state, action) => {
      let item = action.payload;
      let seriesName = item.p[0];
      let series_sds_x = item.p[1];
      let seriesDataName_sx = item.p[2];
      let seriesSymbolInfoName_sds_sym_x = item.p[3];
      let seriesCandleInterval = item.p[4];
      console.log("state createSeries, item: ", { item, seriesName, series_sds_x, seriesDataName_sx, seriesSymbolInfoName_sds_sym_x, seriesCandleInterval });
      state.charts[seriesName] = { ...state.charts[seriesName], [series_sds_x]: { [seriesDataName_sx]: { item, seriesCandleData: [], seriesSymbolInfoName_sds_sym_x, seriesCandleInterval } } };

      state.symbolInfo_sds_sym_x[seriesName] = {};

    },
    symbolResolved: (state, action) => {
      let item = action.payload;
      let seriesName = item.p[0];
      let seriesSymbolInfoName_sds_sym_x = item.p[1];
      let data = item.p[2];

      // let full_name = data.full_name;

      // state.charts[seriesName].symbolInfo = {
      //   ...state.charts[seriesName].symbolInfo,
      //   [seriesSymbolInfoName_sds_sym_x]: {data}
      // }

      state.symbolInfo_sds_sym_x[seriesName][seriesSymbolInfoName_sds_sym_x] = {data};
      
      console.log("symbolResolved", { item });

    },
    modifySeries: (state, action) => {
      let item = action.payload;
      let seriesName = item.p[0];
      let series_sds_x = item.p[1];
      let seriesDataName_sx = item.p[2];
      let seriesSymbolInfoName_sds_sym_x = item.p[3];
      let seriesCandleInterval = item.p[4];

      state.charts[seriesName][series_sds_x] = {
        ...state.charts[seriesName][series_sds_x],
        [seriesDataName_sx]: { 
          item, seriesCandleData: [], seriesSymbolInfoName_sds_sym_x, seriesCandleInterval 
        }
      };
      state.symbolInfo_sds_sym_x[seriesName] = {};

      console.log("state modifySeries, item: ", { item });

    },
    timescaleUpdate: (state, action) => {
      let item = action.payload;
      let seriesName = item.p[0];
      let p1 = item.p[1];
      let numKeysP1 = Object.keys(p1).length;
      let sds_1 = p1['sds_1'];

      try {
        if (numKeysP1 > 0 && sds_1) {
          let seriesDataName_sx = sds_1['t'];
          let newseriesCandleData = sds_1['s'];
          console.log('%c >>> timescale_update : ', 'background: yellow; color: black', "YES-sds_1", { item, numKeysP1, seriesDataName_sx, newseriesCandleData });
          if (Array.isArray(newseriesCandleData)) {
            console.log({ seriesDataName_sx, newseriesCandleData });

            state.charts[seriesName]['sds_1'][seriesDataName_sx] = {
              ...state.charts[seriesName].sds_1[seriesDataName_sx],
              seriesCandleData: [...state.charts[seriesName].sds_1[seriesDataName_sx].seriesCandleData, newseriesCandleData]
            }
          } else {
            console.error("non array newseriesCandleData");
          }

        } else {
          console.log('%c >>> timescaleUpdate no chart data? : ', 'background: yellow; color: red', { item, numKeysP1 });
        }
      } catch (error) {
        console.error("ERROR HERE IN timescaleUpdate reducer", error);
      }

    },

    duMessage: (state, action) => {
      try {
        var timeNow = formatCurrentTimeHMS();
        let item = action.payload;
        let name = item.p[0];
        let p1 = item.p[1];
        // let numKeysP1 = Object.keys(p1).length;
        let sds_1 = p1['sds_1'];

        if (sds_1) {
          let studyName = sds_1['t'];
          let data = sds_1['s'][0]['v'];
          let timestamp = data[0];
          // let open = data[1];
          // let high = data[2];
          // let low = data[3];
          let close = data[4];
          let volume = data[5];

          console.log(timeNow, ">>> DUUUU > t c v",`${timestamp} ${close}  v: ${volume}`, { item });

          state.charts[name]['sds_1'][studyName] = {
            ...state.charts[name].sds_1[studyName],
            duUpdates: {
              ...state.charts[name].sds_1[studyName].duUpdates,
              [timestamp] : {...data}
            }
          }
        }
        else {
          console.debug(timeNow, ">>> DU OTHER > ", { item });
        }


      } catch (error) {
        console.error("ERROR HERE IN duMessage reducer", error);
      }
    },

  },
});

export const { createSeries, modifySeries, symbolResolved, timescaleUpdate, duMessage } = chartSlice.actions;

export const stateCharts = (state) => state.chart.charts;
export const stateSymbolInfos = (state) => state.chart.symbolInfo_sds_sym_x;

export default chartSlice.reducer;
