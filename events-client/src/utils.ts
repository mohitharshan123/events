import { EventToFund } from './types';
import web3 from 'web3-utils';

export const parseEvents = (events: Array<any>): Array<EventToFund> =>
  events?.map((event, index) => ({
    id: index,
    title: event[1],
    description: event[2],
    target: event[3],
    deadline: new Date(parseInt(event[4], 16)).toString(),
    amountCollected: event[5],
    imageUrl: event[6],
    donators: event[7].toString(),
    donations: event[4].toString(),
    refunded: event[9],
  }));

export const toEther = (amount: number) =>
  web3.fromWei(Math.round(amount).toString(), 'ether');
