export default class ConfigClient {
  /**
   *
   * If there is no Limit to check expire till date return false
   * @returns Number to calculate end date
   */
  public static checkExpireTill(): Date | false {
    const days = 2;
    const tillDate = new Date();
    tillDate.setDate(tillDate.getDate() - days);
    return tillDate;
  }

  public static getConnectionExpire(): Date | false {
    const min = 30;
    const connectionExpire = min * 60 * 1000;
    const compareDateTime = new Date(new Date().getTime() - connectionExpire);
    return compareDateTime;
  }
}
