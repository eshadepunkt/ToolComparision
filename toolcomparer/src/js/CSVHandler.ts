//
//CSVReader
//

export function ReadCSVLine(
  csvLine: string,
  seperator = ",",
  rangeEscape = '"',
  outCommenter = "#"
): Array<string> {
  const indexes: Array<number> = [];
  const csv: string = csvLine;

  if (csvLine === "" || csvLine[0] == outCommenter) return [];

  for (let i = 0; i < csv.length; i++) {
    if (csv[i] == seperator) {
      indexes.push(i);
    } else if (csv[i] == rangeEscape) {
      i = GetEndIndexOfRangeEscape({ csvLine: csv }, i, rangeEscape);
    }
  }

  return SplitCSV(csv, GetCommaPositions(indexes, csv.length));
}

//currentIndex is the startIndex of the rangeEscape
//It'll return the index of the closing rangeEscape
function GetEndIndexOfRangeEscape(
  csvLineReference: { csvLine: string },
  currentIndex: number,
  rangeEscape = '"'
): number {
  //Remove Escape Sequence
  csvLineReference.csvLine = StringRemove(
    csvLineReference.csvLine,
    currentIndex,
    1
  );
  //Check next char that would have been next after the Escape Sequence
  if (currentIndex < csvLineReference.csvLine.length) {
    //If the rangeEscape wasn't used to escape it'll parse until the end of rangeEscape
    if (!EscapeRangeEscape(csvLineReference, currentIndex, rangeEscape)) {
      if (currentIndex + 1 < csvLineReference.csvLine.length) {
        ++currentIndex;
        while (currentIndex < csvLineReference.csvLine.length) {
          //currentIndex++;
          if (csvLineReference.csvLine[currentIndex] == rangeEscape) {
            //Remove Escape Sequence
            csvLineReference.csvLine = StringRemove(
              csvLineReference.csvLine,
              currentIndex,
              1
            );
            //If the rangeEscape wasn't used to escape it'll return the index of rangeEscape
            if (!EscapeRangeEscape(csvLineReference, currentIndex, rangeEscape))
              break;
          }

          ++currentIndex;
        }
        //Because we remove the escape sequence, we need to check the char that would come after the escape
        //If we wouldn't subtract one, we would skip the char because the next char after the escape in now at the same index as the removed escape
        --currentIndex;
      }
    }
  }

  return currentIndex;
}

function EscapeRangeEscape(
  csvLineReference: { csvLine: string },
  currentIndex: number,
  rangeEscape = '"'
): boolean {
  if (currentIndex < csvLineReference.csvLine.length) {
    //If this char (and the previous (already removed) char) are rangeEscape, the first will escape the second
    if (csvLineReference.csvLine[currentIndex] == rangeEscape) return true;
  }

  return false;
}

function SplitCSV(
  csvLine: string,
  commaPositions: Array<number>
): Array<string> {
  const splitCSV: Array<string> = [];
  let startIndex = 0;
  let endIndex: number;

  for (let i = 0; i < commaPositions.length; i++) {
    endIndex = commaPositions[i];
    //If there is a comma at the end of the line OR if there are to (or more) commas in a row
    if (startIndex == csvLine.length || startIndex == endIndex) {
      splitCSV.push("");
    } else {
      //Remember: There is Always a 'fake' comma at the end of the line for easier parsing
      splitCSV.push(csvLine.substring(startIndex, endIndex));
    }

    startIndex = endIndex + 1;
  }

  return splitCSV;
}

function GetCommaPositions(
  indexes: Array<number>,
  lineLenght: number
): Array<number> {
  //Add fake comma for better parsing
  indexes.push(lineLenght);

  return indexes;
}

//
//CSVWriter
//

export function WriteCSVLine(
  entries: Array<Array<string>>,
  seperator = ",",
  rangeEscape = '"',
  autoEscape = true,
  escapeAll = true
): string {
  let csvLines = "";

  const linesCount: number = entries.length;
  for (let i = 0; i < linesCount; i++) {
    const line: Array<string> = entries[i];

    const entryCount: number = line.length;
    for (let k = 0; k < entryCount; k++) {
      const entry: string = line[k];

      if (autoEscape) {
        let entr: string = entry.replace(
          rangeEscape,
          rangeEscape + rangeEscape
        );
        //If the entry is not empty or it does not only contain rangeEscapes OR if the entry contains a separator
        if (
          (escapeAll && StringTrim(entr, rangeEscape) !== "") ||
          entr.includes(seperator)
        ) {
          entr = rangeEscape + entr + rangeEscape;
        }

        csvLines += entr + seperator;
      } else {
        csvLines += entry + seperator;
      }
    }

    csvLines += "\n";
  }

  //NOTE: A comma was added at the end that must be removed
  csvLines = csvLines.replace(seperator + "\n", "\n");

  return csvLines;
}

export function WriteCSVComment(comment: string, outCommenter = "#"): string {
  return outCommenter + comment + "\n";
}

//
//Other
//

export function StringRemove(
  str: string,
  startIndex: number,
  count: number
): string {
  return str.substring(0, startIndex) + str.substring(startIndex + count);
}

export function StringTrim(str: string, charToRemove: string) {
  let trimmed: string = str;

  while (trimmed.charAt(0) == charToRemove) {
    trimmed = trimmed.substring(1);
  }

  while (trimmed.charAt(trimmed.length - 1) == charToRemove) {
    trimmed = trimmed.substring(0, trimmed.length - 1);
  }

  return trimmed;
}
