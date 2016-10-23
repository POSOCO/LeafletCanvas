/**
 * Created by Nagasudhir on 8/4/2016.
 */
"use strict";

function CSVReader() {
    this.fileIterator = 0;
    this.filesArray = [];
    this.pmuSourcesArray = [];

    this.resetAndCreateArrays = resetAndCreateArrays.bind(this);
    this.pushFiles = pushFiles.bind(this);
    this.afterEachRead = afterEachRead.bind(this);
    this.loadNext = loadNext.bind(this);

    //file reader feature
    function pushFiles(newFile) {
        this.filesArray.push(newFile);
    }

    function resetAndCreateArrays() {
        this.fileIterator = 0;
        //reset all arrays
        this.filesArray = [];
        this.pmuSourcesArray = [];
    }

    //file reader feature
    function loadNext() {
        this.filesArray[this.fileIterator] = null;
        this.fileIterator = this.fileIterator + 1;
        if (this.fileIterator < this.filesArray.length) {
            this.afterEachRead();
        }
    }

    //file reader feature
    function afterEachRead() {
        var reader = new FileReader();
        var file = this.filesArray[this.fileIterator];
        reader.onload = function (e) {
            this.pmuSourcesArray = CSVToArray(reader.result);
            modifyDateString(this.pmuSourcesArray[3][0]);
            this.pmuSourcesArray = readFramesFromCSV(this.pmuSourcesArray);
            console.log("The parsed pmu voltage points file is ");
            console.log(this.pmuSourcesArray);
            timeFrames.frames = this.pmuSourcesArray;
            this.pmuSourcesArray = [];
            this.loadNext();
        }.bind(this);
        reader.readAsText(file);
    }
}