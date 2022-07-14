import { NextPage } from "next";
import { Card, makeStyles, Table, TableBody, TableCell, TableContainer, TableRow } from "@material-ui/core";
import { convertString } from "../utils/convertText";
import styles from '../styles/Home.module.css';

type Props = {
    [key: string]: string | number
}

interface IProps {
    data: Props
}

const useStyles = makeStyles({
    card: {
        marginTop: '20px',
        width: '100%'
    },
    title: {
        width: '100%',
        fontSize: '20px',
        marginTop: '4px',
        marginBottom: '17px'
    },
    cell: {
        minWidth: '180px'
    }
});

const Response: NextPage<IProps> = ({ data }) => {
    const classes = useStyles();

    return (
        <Card className={`${styles.grid} ${classes.card}`} >
            <h6 className={classes.title}>Responce</h6>
            <TableContainer>
                <Table>
                    <TableBody>
                        {
                            Object.keys(data).map(key => (
                                <TableRow>
                                    <TableCell className={classes.cell} component="th" scope="row">
                                        {convertString(key)}
                                    </TableCell>
                                    <TableCell>{data[key]}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card >
    )
}

export default Response
