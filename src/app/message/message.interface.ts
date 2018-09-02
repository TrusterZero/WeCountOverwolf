
export enum ErrorMessage {
  // @ts-ignore
  404 = 'Can\'t find your match',
  // @ts-ignore
  403 = 'Can\'t access Riot\'s Server',
  // @ts-ignore
  401 = 'Can\'t access Riot\'s Server',
  // @ts-ignore
  1001 = 'No enemies around!',
  // @ts-ignore
  1002 = 'WeCount can\'t be used in this gamemode'
}


export interface Message {
  text: string;
  loading: boolean;
  action: () => void;
  actionText: string;
}
