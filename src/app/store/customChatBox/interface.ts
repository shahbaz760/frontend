export interface customChatProp {
  taskId: number | string;
  message: string;
  files: string;
}

export interface customChatInitialStates {
  isAddLoadingChats: boolean;
  chats: Array<any>;
  total_length: number | null;
  status?: string;
}
