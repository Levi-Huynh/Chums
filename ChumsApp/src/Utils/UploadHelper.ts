import Papa from 'papaparse';

export class UploadHelper {

    static async getCsv(files: FileList, fileName: string) {
        var file = this.getFile(files, fileName);
        if (file !== null) return await this.readCsv(file);
        else return null;
    }

    static readCsv(file: File) {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onload = () => {
                var result = [];
                var csv = reader.result.toString();
                var data = Papa.parse(csv, { header: true });

                for (let i = 0; i < data.data.length; i++) {
                    var r: any = this.getStrippedRecord(data.data[i]);
                    result.push(r);
                }
                resolve(result);
            };
            reader.onerror = () => {
                reader.abort();
                reject(new DOMException("Problem parsing input file."));
            };
            reader.readAsText(file);
        });
    }

    static getFile(files: FileList, fileName: string) {
        for (let i = 0; i < files.length; i++) if (files[i].name == fileName) return files[i];
        return null;
    }

    static readImage(files: FileList, photoUrl: string) {
        return new Promise<string>((resolve, reject) => {
            var match = false;
            for (let i = 0; i < files.length; i++) {
                if (files[i].name === photoUrl) {
                    const reader = new FileReader();
                    reader.onload = () => { resolve(reader.result.toString()); };
                    reader.onerror = () => { reject(new DOMException("Error reading image")) }
                    reader.readAsDataURL(files[i]);
                }
            }
            if (match) reject(new DOMException("Did not find image"));
        });
    }

    static getStrippedRecord(r: any) {
        var names = Object.getOwnPropertyNames(r)
        for (let j = names.length - 1; j >= 0; j--) {
            var n = names[j];
            if (r[n] == '') delete r[n];
        }
        return r;
    }

}