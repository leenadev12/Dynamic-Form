import axios from 'axios'
import { NextPage } from "next";
import { useEffect, useState } from 'react';
import { Button, Card, CircularProgress, Grid, makeStyles, MenuItem, TextField } from '@material-ui/core';

import Header from '../components/Header';
import Response from '../components/Response';
import styles from '../styles/Home.module.css'

const useStyles = makeStyles({
  form: {
    width: '70%'
  },
  field: {
    width: '100%',
    marginTop: '25px'
  },
  button: {
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
  const classes = useStyles()
  const [fields, setFields] = useState<ItemType[]>([]);
  const [errorText, setErrorText] = useState("");
  const [responseData, setResponceData] = useState<any>();
  const [disableFields, setDisableFields] = useState(false);

  useEffect(() => {
    if (data) {
      setFields(data);
    }
  }, []);

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
    setResponceData(null);
    setDisableFields(true)

    let data = {};
    Object.keys(event.target).forEach(key => {
      const fieldVal = event.target[key].id ? event.target[key].id : event.target[key].namea
      if (fieldVal) data = { ...data, [fieldVal]: event.target[key].value }
    })

    if (!Object.keys(data).includes('email')) data = { ...data, emailAddress: 'ulventech@gmail.com' }

    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }

    const response = await axios.post('https://ulventech-react-exam.netlify.app/api/form', data, { headers })
      .then(response => {
        if (response) {
          setErrorText('')
          setDisableFields(false)
          setResponceData(response?.data?.data)
        }
      })
      .catch(err => {
        if (err) setErrorText(err?.response?.data?.message)
      })

  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <main className={styles.main}>
          <Card className={styles.grid}>
            <form onSubmit={handleSubmit}>
              <Grid className={classes.form}>
                {
                  fields?.map((item: ItemType, index: number) => {
                    if (item['type'] === 'text' || item['type'] === 'multiline') {
                      return <TextField
                        className={classes.field}
                        variant="outlined"
                        label={(item['fieldName'].charAt(0).toUpperCase() + item['fieldName'].slice(1)).replace(/[A-Z]/g, ' $&').trim()}
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
                        label={(item['fieldName'].charAt(0).toUpperCase() + item['fieldName'].slice(1)).replace(/[A-Z]/g, ' $&').trim()}
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
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  size={'large'}
                  disabled={disableFields}
                  style={{ marginTop: 25, width: 300 }}
                >
                  Submit
                  {disableFields && <CircularProgress className={classes.circularProgress} size={20} />}
                </Button>
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

export default Home
