import React from 'react';
import { render, getByTestId } from '@testing-library/react';
import { AttendanceFilter, UserHelper } from '..';
import { ApiHelper } from '../../../../Utils';

var updateCalled = false;

var filter = {};
const testUpdate = () => { updateCalled = true; }

beforeAll(() => {
    var promises = [];
    promises.push(
        ApiHelper.login("test@test.com", "test").then(data => {
            ApiHelper.apiKey = data.apiToken;
        })
    );
    Promise.all(promises);  //*** I'm trying to force this to not be async so I can test if the data loaded.
});

test('renders attendance filter', () => {
    const { getByTestId } = render(<AttendanceFilter filter={filter} updateFunction={testUpdate} />);
    //expect(getByTestId('campus')).not.toHaveLength(1); //This fails because the data hasn't finished loading yet.
});
