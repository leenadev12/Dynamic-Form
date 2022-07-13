import { NextPage } from "next";
import { Card, Table, TableBody, TableCell, TableContainer, TableRow } from "@material-ui/core";

type Props = {
    [key: string]: string | number
}

interface IProps {
    data: Props
}

const Response: NextPage<IProps> = ({ data }) => {

    return (
        <Card>
            <h6>Responce</h6>
            <TableContainer>
                <Table>
                    <TableBody>
                        {
                            Object.keys(data).map(key => (
                                <TableRow>
                                    <TableCell component="th" scope="row">
                                        {key}
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
