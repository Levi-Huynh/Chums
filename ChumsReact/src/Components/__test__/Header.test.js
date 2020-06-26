import React from 'react';
import { render, getByTestId } from '@testing-library/react';
import { Header, UserHelper } from '..';

//*** Would like to make this typescript but the render method won't take components when saved as .ts


test('renders header with name', () => {
    UserHelper.person = { displayName: 'Jeremy' }
    const { getByTestId: any } = render(<Header />);
    expect(getByTestId(document, 'displayName')).toHaveTextContent('Jeremy');
});
