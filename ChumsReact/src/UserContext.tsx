import React, { Component } from 'react'

interface UserContextInterface {
  userName: string
  setUserName: (userName: string) => void

}

const UserContext = React.createContext<UserContextInterface | undefined>(undefined);

interface Props {
  children: any;
}

export const UserProvider = ({
  children
}: Props) => {
  const [userName, setUserName] = React.useState("");

  return (
    <UserContext.Provider value={{ userName, setUserName }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;