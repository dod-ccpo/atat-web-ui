export interface Clin {
  clinNumber?: string;
  obligatedFunds: string;
  idiqClin?: string;
  popStartDate: string;
  popEndDate: string;
  totalClinValue: number;
}

export interface FileMetadataSummary {
  /**
   * name of file when uploaded
   * @type {string}
   * @memberof FileMetadataSummary
   */
  name: any;
  /**
   * Should be a UUID. Will be the S3 Object Key.
   * @type {string}
   * @memberof FileMetadataSummary
   */
  id: any;
}

export interface TaskOrder {
  clins: Array<Clin>;
  /**
   * Metadata associated with file which was previously uploaded by POST /taskOrderFiles
   * @type {FileMetadataSummary}
   * @memberof TaskOrder
   */
  taskOrderFile: FileMetadataSummary;
  /**
   * TO numbers are 13 characters. TO modifications are 17 characters.
   * @type {string}
   * @memberof TaskOrder
   */
  taskOrderNumber: string;
}
