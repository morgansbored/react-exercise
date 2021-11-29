import React, {useState} from 'react';
import styled, { ThemeProvider } from "styled-components";
import * as yup from "yup";
import { Field, Form, Formik } from "formik";
import { Button, Text, TextField, Select, crukTheme } from "@cruk/cruk-react-components";

const SiteWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

function App({ items }) {
  const [searchResults, setSearchResults] = useState(items);

  const formSchema = yup.object().shape({
    keywords: yup.string()
      .required("Please enter keywords to search."),
    mediaType: yup.string()
      .required("Please choose a media type."),
    yearStart: yup.string()
      .required("Please enter a year."),
  });

  return (
    <ThemeProvider theme={crukTheme}>
      <SiteWrapper>
        <div>
          <h1>NASA Image Library Search</h1>
        </div>
        <div>
          <Formik
            initialValues={{
              keywords: "",
              mediaType: "",
              yearStart: "",
            }}
            validationSchema={formSchema}
            onSubmit={async (values) => {
              const results = await fetch(
                `https://images-api.nasa.gov/search?media_type=${values.mediaType}&q=${values.keywords}&year_start=${values.yearStart}`
              );
              const previews = await results.json();
              setSearchResults(await previews.collection.items);
            }}
            >
            {({ errors, touched }) => {
              return (
                <Form>
                  <Field name="keywords">
                    {({ field }) => (
                      <>
                        <TextField
                          label="Keywords" 
                          type="text"
                          required
                          {...field}
                        />
                        {errors.keywords && touched.keywords && <p>{errors.keywords}</p>}
                      </>
                    )}
                  </Field>
                  <Field name="mediaType">
                  {({ field }) => (
                      <>
                        <Select
                          label="Media type"
                          required
                          {...field}
                        >
                          <option value=""
                          >
                            --Please choose an option--
                          </option>
                          <option value="audio">
                            Audio
                          </option>
                          <option value="video">
                            Video
                          </option>
                          <option value="image">
                            Image
                          </option>
                        </Select>
                        {errors.mediaType && touched.mediaType && <p>{errors.mediaType}</p>}
                      </>
                    )}
                  </Field>
                  <Field name="yearStart">
                    {({ field }) => (
                      <>
                        <TextField
                          label="Year start" 
                          type="text"
                          required
                          {...field}
                        />
                        {errors.yearStart && touched.yearStart && <p>{errors.yearStart}</p>}
                      </>
                    )}
                  </Field>

                  <Button type="submit">Submit</Button>
                </Form>
              )
            }}
          </Formik>
        </div>
        <div>
        {searchResults &&
              searchResults.map((preview) => (
                <Text
                  key={preview.data[0].nasa_id}
                  nasaId={preview.data[0].nasa_id}
                >
                {preview.data[0].description}
                </Text>
              ))}
        </div>
      </SiteWrapper>
    </ThemeProvider>
  );
}

export default App;

