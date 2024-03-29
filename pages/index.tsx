import axios from 'axios'
import { NextPage } from "next";
import { useEffect, useState } from 'react';
import { Button, Card, CircularProgress, Grid, makeStyles, MenuItem, TextField } from '@material-ui/core';

import Header from '../components/Header';
import Response from '../components/Response';
import { submit } from '../redux/operation';
import { convertString } from '../utils/convertText';
import { selectError, selectResponse } from '../redux/formSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import styles from '../styles/Home.module.css';

const useStyles = makeStyles({
  form: {
    width: '100%'
  },
  field: {
    width: '100%',
    marginTop: '25px'
  },
  errrText: {
    color: 'red'
  },
  circularProgress: {
    color: 'white',
    position: 'relative',
    left: '10px'
  },
  card: {
    width: '100%'
  }
});

type ItemType = {
  fieldName: string,
  type: string,
  value: string,
  options?: Array<string> | undefined
}

interface Props {
  data: Array<ItemType>;
}

const Home: NextPage<Props> = ({ data }) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const response = useAppSelector(selectResponse)
  const errMessage = useAppSelector(selectError)
  const [fields, setFields] = useState<ItemType[]>([]);
  const [errorText, setErrorText] = useState("");
  const [responseData, setResponseData] = useState<any>();
  const [disableFields, setDisableFields] = useState(false);

  useEffect(() => {
    if (data) {
      setFields(data);
    }
    if (response) {
      setErrorText('');
      setDisableFields(false);
      setResponseData(response?.data);
    }
    if (errMessage) {
      setResponseData(null);
      setErrorText(errMessage)
    }
  }, [response, errMessage]);

  const handleChange = (value: string | number, item: ItemType) => {
    fields?.map((field: ItemType, index: number) => {
      if (field['fieldName'] === item['fieldName']) {
        let temp = fields
        temp.splice(index, 1, { ...item, [`${field['value']}`]: value })
        setFields(temp)
      }
    })
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setResponseData(null);
    setDisableFields(true)

    let data = {};
    Object.keys(event.target).forEach(key => {
      const fieldVal = event.target[key].id ? event.target[key].id : event.target[key].name
      if (fieldVal) data = { ...data, [fieldVal]: event.target[key].value }
    })

    if (!Object.keys(data).includes('email')) data = { ...data, emailAddress: 'ulventech@gmail.com' }

    dispatch(submit(data))
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <main className={styles.main}>
          <Card className={`${styles.grid} ${classes.card}`}>
            <form onSubmit={handleSubmit}>
              <Grid className={classes.form}>
                {
                  fields?.map((item: ItemType, index: number) => {
                    if (item['type'] === 'text' || item['type'] === 'multiline') {
                      return <TextField
                        className={classes.field}
                        variant="outlined"
                        label={convertString(item['fieldName'])}
                        placeholder={item['fieldName']}
                        id={item['fieldName']}
                        multiline={item['type'] === 'multiline' ? true : false}
                        minRows={item['type'] === 'multiline' ? 5 : 1}
                        maxRows={item['type'] === 'multiline' ? 10 : 1}
                        key={index}
                        defaultValue={item['value']}
                        disabled={disableFields}
                        onChange={(e) => handleChange(e.target.value, item)}
                      />
                    }
                    if (item['type'] === 'select') {
                      return <TextField
                        select
                        variant="outlined"
                        label={convertString(item['fieldName'])}
                        key={index}
                        name={item['fieldName']}
                        className={classes.field}
                        defaultValue={item['value']}
                        disabled={disableFields}
                        onChange={(e) => handleChange(e.target.value, item)}
                        margin="normal"
                      >
                        {item['options']?.map((option: string) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    }
                  })
                }
                {errorText && <p className={classes.errrText}>{`* ${errorText}`}</p>}
                <div className={styles.btnsubmit}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={disableFields}
                    style={{ width: 300 }}
                  >
                    Submit
                    {disableFields && <CircularProgress className={classes.circularProgress} size={20} />}
                  </Button>
                </div>
              </Grid>
            </form>
          </Card>
          {responseData && <Response data={responseData} />}
        </main>
      </div>
    </>
  )
}

export async function getServerSideProps() {
  let data = {};
  await axios
    .get("https://ulventech-react-exam.netlify.app/api/form")
    .then((response) => {
      if (response) {
        data = response.data.data;
      }
    })
    .catch((error) => {
      console.log("Error", error);
    });
  return { props: { data } }
}

export default Home;
