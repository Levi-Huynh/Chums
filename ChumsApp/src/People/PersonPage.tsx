import React from 'react';
import { Person, Groups, Tabs, Household, ImageEditor, PersonHelper, UserHelper, ApiHelper } from './Components'
import { Row, Col } from 'react-bootstrap';
import { RouteComponentProps } from "react-router-dom";

type TParams = { id?: string };

export const PersonPage = ({ match }: RouteComponentProps<TParams>) => {

    const [person, setPerson] = React.useState(null);
    const [photoUrl, setPhotoUrl] = React.useState<string>(null);
    const [editPhotoUrl, setEditPhotoUrl] = React.useState<string>(null);


    const loadData = () => { ApiHelper.apiGet('/people/' + match.params.id).then(data => setPerson(data)); }
    const handlePhotoUpdated = (dataUrl: string) => setPhotoUrl(dataUrl);
    const handlePhotoDone = () => setEditPhotoUrl(null);
    const getImageEditor = () => { return (editPhotoUrl === null) ? null : <ImageEditor updatedFunction={handlePhotoUpdated} doneFunction={handlePhotoDone} person={person} /> }
    const togglePhotoEditor = (show: boolean) => { setEditPhotoUrl((show) ? PersonHelper.getPhotoUrl(person) : null); }
    const getGroups = () => { return (UserHelper.checkAccess('Group Members', 'View')) ? <Groups personId={person?.id} /> : null }

    React.useEffect(loadData, [match.params.id]);

    return (
        <Row>
            <Col lg={8}>
                <Person person={person} photoUrl={photoUrl} togglePhotoEditor={togglePhotoEditor} />
                <Tabs personId={person?.id} />
            </Col>
            <Col lg={4}>
                {getImageEditor()}
                <Household personId={person?.id} />
                {getGroups()}
            </Col>
        </Row >
    )

}