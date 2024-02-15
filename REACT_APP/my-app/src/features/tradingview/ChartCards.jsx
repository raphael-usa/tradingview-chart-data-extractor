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
                                <hr/>
                                show little candleData info here #TODO
                            </CardContent>
                            <CardActions disableSpacing>
                                <Button onClick={() => {
                                    showChartData(chartObj.key);
                                }} variant="contained">View data #TODO toggle modal</Button>
                                <IconButton aria-label="share">
                                    <ShareIcon />
                                </IconButton>
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