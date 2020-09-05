import React, { useCallback } from 'react';
import { InputBox, PersonHelper, ApiHelper, PersonInterface } from './';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { Button } from 'react-bootstrap';


interface Props {
    person: PersonInterface,
    updatedFunction: (dataUrl: string) => void,
    doneFunction: () => void
}

export const ImageEditor: React.FC<Props> = (props) => {
    const [originalUrl, setOriginalUrl] = React.useState('about:blank');
    const [currentUrl, setCurrentUrl] = React.useState('about:blank');
    const [dataUrl, setDataUrl] = React.useState(null);
    var timeout: any = null;

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        let files;
        if (e.target) files = e.target.files;
        const reader = new FileReader();
        reader.onload = () => {
            var url = reader.result.toString();
            setCurrentUrl(url);
            setDataUrl(url);
        };
        reader.readAsDataURL(files[0]);
    }

    const getHeaderButton = () => {
        return (<div>
            <input type="file" onChange={handleUpload} id="fileUpload" accept="image/*" style={{ display: 'none' }} />
            <Button size="sm" variant="info" onClick={(e: React.MouseEvent) => { e.preventDefault(); document.getElementById('fileUpload').click(); }} >Upload</Button>
        </div>);
    }

    const cropper = React.useRef(null);

    const cropCallback = () => {
        if (cropper.current !== null) {
            var url = cropper.current.getCroppedCanvas({ width: 400, height: 300 }).toDataURL();
            setDataUrl(url);
            props.updatedFunction(url);
        }
    }

    const handleCrop = () => {
        if (timeout !== null) {
            window.clearTimeout(timeout);
            timeout = null;
        }
        timeout = window.setTimeout(cropCallback, 200);
    }

    const handleSave = () => {
        /*
        var photos = [{ id: props.person.id, url: dataUrl }];

        ApiHelper.apiPost('/people/photos', photos).then((d) => {
            props.updatedFunction('https://app.chums.org' + d[0]);
            props.doneFunction();
        });*/
        props.updatedFunction(dataUrl);
        props.doneFunction();
    }
    const handleCancel = () => { props.updatedFunction(originalUrl); props.doneFunction(); }
    const handleDelete = () => {
        //ApiHelper.apiDelete('/people/photos/' + props.person.id).then(() => props.doneFunction()); 
        props.updatedFunction('/images/sample-profile.png');
        props.doneFunction();
    }
    const init = useCallback(() => {
        var startingUrl = PersonHelper.getPhotoUrl(props.person)
        setOriginalUrl(startingUrl);
        setCurrentUrl(startingUrl);
    }, [props.person]);

    React.useEffect(init, [props.person]);

    return (
        <InputBox id="cropperBox" headerIcon="" headerText="Crop" saveFunction={handleSave} saveText={"Update"} cancelFunction={handleCancel} deleteFunction={handleDelete} headerActionContent={getHeaderButton()}  >
            <Cropper
                ref={cropper}
                src={currentUrl}
                style={{ height: 240, width: '100%' }}
                aspectRatio={4 / 3}
                guides={false}
                crop={handleCrop} />
        </InputBox>
    );
}

