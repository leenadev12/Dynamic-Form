import { NextPage } from "next";
import { AppBar, Box, makeStyles, Toolbar, Typography } from "@material-ui/core";

const useStyles = makeStyles({
    p: {
        fontSize: '20px',
        fontWeight: 'bold'
    }
});

const Header: NextPage = () => {
    const classes = useStyles();

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography className={classes.p}>
                        Ulven Tech
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Header
