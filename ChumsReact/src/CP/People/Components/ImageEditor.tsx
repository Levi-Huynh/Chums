import React, { LegacyRef } from 'react';
import { InputBox, PersonHelper, ApiHelper, HouseholdEdit } from './';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { PersonInterface } from '../../../Utils';


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
            <a href="#" className="btn btn-sm btn-info" onClick={(e: React.MouseEvent) => { e.preventDefault(); document.getElementById('fileUpload').click(); }} >Upload</a>
        </div>);
    }

    const cropper = React.useRef(null);

    const cropCallback = () => {
        if (cropper.current !== null) {
            setDataUrl(cropper.current.getCroppedCanvas().toDataURL());
            props.updatedFunction(dataUrl);
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
        var photos = [{ id: props.person.id, url: dataUrl }];
        ApiHelper.apiPost('/people/photos', photos).then(() => props.doneFunction());
    }
    const handleCancel = () => { props.updatedFunction(originalUrl); props.doneFunction(); }
    const handleDelete = () => { ApiHelper.apiDelete('/people/photos/' + props.person.id).then(() => props.doneFunction()); props.updatedFunction('/images/sample-profile.png'); }
    const init = () => {
        var startingUrl = PersonHelper.getPhotoUrl(props.person.id, props.person.photoUpdated)
        setOriginalUrl(startingUrl);
        setCurrentUrl(startingUrl);
    }

    React.useEffect(() => init(), [props.person]);

    return (
        <InputBox headerIcon="" headerText="Crop" saveFunction={handleSave} saveText={"Update"} cancelFunction={handleCancel} deleteFunction={handleDelete} headerActionContent={getHeaderButton()}  >
            <Cropper
                ref={cropper}
                src={currentUrl}
                style={{ height: 360, width: '100%' }}
                aspectRatio={4 / 3}
                guides={false}
                crop={handleCrop} />
        </InputBox>
    );
}

