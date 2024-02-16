import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import Button from '@mui/material/Button';



// import * as React from 'react';
// import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
    { field: 'id', type: 'text', headerName: 'timestamp', width: 120 },
    { field: 'v', type: 'number', headerName: 'volume', width: 120 },
    { field: 'o', type: 'number', headerName: 'open', width: 120 },
    { field: 'h', type: 'number', headerName: 'high', width: 120 },
    { field: 'l', type: 'number', headerName: 'low', width: 120 },
    { field: 'c', type: 'number', headerName: 'close', width: 120 },
    //   {
    //     field: 'fullName',
    //     headerName: 'Full name',
    //     description: 'This column has a value getter and is not sortable.',
    //     sortable: false,
    //     width: 160,
    //     valueGetter: (params) =>
    //       `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    //   },
];

const demoRows = [
    { id: 1, v: 8123.3, o: 123, h: 123.5, l: 100, c: 111.5 },
    { id: 22222, v: 8123.3, o: 123, h: 123.5, l: 100, c: 111.5 },
    { id: 1567567, v: 8123.3, o: 123, h: 123.5, l: 100, c: 111.5 },
    { id: 12314321, v: 8123.3, o: 123, h: 123.5, l: 100, c: 111.5 },
    { id: 76745451, v: 8123.3, o: 123, h: 123.5, l: 100, c: 111.5 },
    { id: 111111, v: 8123.3, o: 123, h: 123.5, l: 100, c: 111.5 },
    { id: 1, v: 8123.3, o: 123, h: 123.5, l: 100, c: 111.5 },
];

function DataGridDemo({ candleData }) {
    const [rows, setRows] = React.useState([]);

    React.useEffect(() => {
        if (candleData) {
            let newRows = [];
            console.log("DataGridDemo useEffect", { candleData });
            candleData.forEach(lists => {
                lists.forEach(list => {
                    let item = list.v;
                    let timestamp = item[0];
                    let o = item[1];
                    let h = item[2];
                    let l = item[3];
                    let c = item[4];
                    let v = item[5];
                    let newObj = { id: timestamp, v, o, h, l, c };
                    newRows.push(newObj);
                });
            });
            // console.log({newRows});

            const uniqueRows = Array.from(new Set(newRows.map(obj => obj.id))).map(id => {
                return newRows.find(obj => obj.id === id);
            });

            if (uniqueRows.length !== newRows.length) {
                console.warn("Duplicates existed and have been removed.");
            }

            console.log({uniqueRows});
            setRows(uniqueRows);
        }
    }, [candleData]);

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 100,
                        },
                    },
                }}
                pageSizeOptions={[100]}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>
    );
}

function ScrollDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [scroll, setScroll] = React.useState('paper');

    const handleClickOpen = (scrollType) => () => {
        setOpen(true);
        setScroll(scrollType);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    return (
        <React.Fragment>
            <Button onClick={handleClickOpen('paper')}>show ChartData</Button>
            {/* <Button onClick={handleClickOpen('body')}>scroll=body</Button> */}
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                fullWidth={true}
                maxWidth="lg"
            >
                <DialogTitle id="scroll-dialog-title">{props.chartKey} --- {props.chartID}</DialogTitle>
                <DialogContent dividers={scroll === 'paper'}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                    >
                        duUpdates: {JSON.stringify(props.duUpdates)}<br />


                        {/* {[...new Array(50)]
                            .map(
                                () => `abcking Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`,
                            )
                            .join('\n')} */}
                    </DialogContentText>
                    <DataGridDemo candleData={props.candleData} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleClose}>Subscribe</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}



// const ExpandMore = styled((props) => {
//     const { expand, ...other } = props;
//     return <IconButton {...other} />;
// })(({ theme, expand }) => ({
//     transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
//     marginLeft: 'auto',
//     transition: theme.transitions.create('transform', {
//         duration: theme.transitions.duration.shortest,
//     }),
// }));

export default function ChartCards({ chart_objs }) {
    // const [expanded, setExpanded] = React.useState(false);

    // const handleExpandClick = () => {
    //     setExpanded(!expanded);
    // };


    const showChartData = (key) => {
        console.log("showChartData", { key });
    }

    return (
        <div className='BBBB'>
            {/* {JSON.stringify(chart_objs)} */}

            {chart_objs.length !== 0 && (
                chart_objs.map((chartObj) => (
                    <span key={chartObj.key} style={{ display: "inline-block" }}>
                        <Card sx={{ maxWidth: 345, margin: "5px 5px", overflowX: "scroll" }}>
                            <CardHeader
                                action={
                                    <IconButton aria-label="settings">
                                        <MoreVertIcon />
                                    </IconButton>
                                }
                                title={`${chartObj.full_name}`}
                            />
                            <CardContent>
                                <Typography variant="body1" color="text.secondary">
                                    interval:{chartObj.interval}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {chartObj.latestDuUpdate ? (
                                        <>
                                            Time: {JSON.stringify(chartObj.latestDuUpdate["0"])}<br />
                                            Close: {JSON.stringify(chartObj.latestDuUpdate["4"])}<br />
                                            Volume: {JSON.stringify(chartObj.latestDuUpdate["5"])}<br />
                                        </>
                                    ) : null}


                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {chartObj.key}
                                </Typography>
                                <hr />
                                show little candleData info here #TODO
                            </CardContent>
                            <CardActions disableSpacing>
                                {/* <Button onClick={() => {
                                    showChartData(chartObj.key);
                                }} variant="contained">
                                    View data #TODO toggle modal
                                </Button> */}
                                <ScrollDialog chartKey={chartObj.key} chartID={chartObj.chartID} duUpdates={chartObj.duUpdates} candleData={chartObj.candleData} />
                                {/* <IconButton aria-label="share">
                                    <ShareIcon />
                                </IconButton> */}
                                {/* <ExpandMore
                                    expand={expanded}
                                    onClick={handleExpandClick}
                                    aria-expanded={expanded}
                                    aria-label="show more"
                                >
                                    <ExpandMoreIcon />
                                </ExpandMore> */}
                            </CardActions>
                            {/* <Collapse in={expanded} timeout="auto" unmountOnExit>
                                <CardContent>
                                    <Typography paragraph>Method:</Typography>
                                    <Typography paragraph>
                                        Heat 1/2 cup of the broth in a pot until simmering, add saffron and set
                                        aside for 10 minutes. abc123
                                    </Typography>
                                </CardContent>
                            </Collapse> */}
                        </Card>
                    </span>
                    // <div key={chartObj.key}>
                    //     <RecipeReviewCard />
                    //     <h4>Name: {chartObj.full_name}</h4>
                    //     <span><button>do something to ticker data</button></span>
                    //     <h4>Interval: {chartObj.interval}</h4>
                    //     <h4>key: {chartObj.key}</h4>
                    //     <ul style={{ textAlign: "left" }}> candleData: array of lists: [[],[], ...]. <br />
                    //         num of lists: {chartObj.candleData.length}
                    //         {chartObj.candleData.map((post, index) => (
                    //             <li key={index}>length of list: {post.length}  1st item in list: {JSON.stringify(post[0])}</li>
                    //         ))}

                    //     </ul>
                    //     {JSON.stringify(chartObj.duUpdates)}
                    //     <hr />
                    // </div>
                ))
            )}
            {chart_objs.length === 0 && <p>No data available</p>}
        </div>
    );
};