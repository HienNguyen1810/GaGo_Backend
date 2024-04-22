/*
 *
 * HomePage
 *
 */

import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import { Link } from '@strapi/design-system/Link';
import { SimpleMenu } from '@strapi/design-system/v2/SimpleMenu';
import { Button } from '@strapi/design-system/Button';
import { Typography } from '@strapi/design-system/Typography';
import { Table } from '@strapi/design-system/Table';
import { Box } from '@strapi/design-system/Box';

import { ArrowLeft } from '@strapi/icons';
import { BaseHeaderLayout } from '@strapi/design-system/Layout';
import { useHistory } from 'react-router-dom';
import getMessage from '../../utils/getMessage';
import { request, auth, useNotification, LoadingIndicatorPage } from '@strapi/helper-plugin';
const HomePage = () => {
  const { goBack } = useHistory();
  const [selectTemplate, setTemplate] = useState("Template");
  //
  return (
    <Box background="neutral100">
      <BaseHeaderLayout
        navigationAction={
          <Link startIcon={<ArrowLeft />} to="#" onClick={goBack}>
            {getMessage('GoBack')}
          </Link>
        }
        title={getMessage('howToUse')}
        subtitle={getMessage('howToUse.content')}
        as="h2"
      />

      <Box padding={10} paddingTop={0} background="neutral100" hasRadius>
        <Typography > Select template</Typography>
        <SimpleMenu label={selectTemplate} >
          <Typography onClick={(e) => { setTemplate("Template 1"); }}>Template 1</Typography>
          <Typography onClick={(e) => { setTemplate("console.log(e)"); }}>console.log(e)</Typography>
        </SimpleMenu>
        <Button>Import Excel</Button>
      </Box>
      <Box padding={10} paddingTop={0} background="neutral100" hasRadius>
        <Table></Table>
      </Box>
    </Box >
  );
};

export default HomePage;
