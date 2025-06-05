# https://matthewyancey.github.io/MattGPT/
from openai import OpenAI
import time
import os

from dotenv import load_dotenv
load_dotenv()


class Assistant():

    def __init__(self):
        self.client = OpenAI(api_key=os.getenv('OPENAIKEY'), default_headers={"OpenAI-Beta": "assistants=v2"})
        self.assistant = self.client.beta.assistants.retrieve(assistant_id=os.getenv('ASSISTANTKEY'))
        self.thread = self.client.beta.threads.create()

    def submit_message(self, user_message: str):
        message = self.client.beta.threads.messages.create(
            thread_id = self.thread.id,
            role = 'user',
            content = user_message
        )
        print(message)
        run = self.client.beta.threads.runs.create(
            thread_id=self.thread.id,
            assistant_id=self.assistant.id
        )

        while True:
            time.sleep(2)
            run = self.client.beta.threads.runs.retrieve(
                thread_id=self.thread.id,
                run_id=run.id
            )
            if run.status == 'completed':
                break
            elif run.status == 'failed':
                return 'Opps, looks like we ran out of API credits.'
            else:
                pass

        messages = self.client.beta.threads.messages.list(
            thread_id=self.thread.id
        )

        return messages.data[0].content[0].text.value


class Assistant_Test():

    def __init__(self, t):
        self.sleep_ammount = t

    def submit_message(self, user_message: str):
        time.sleep(self.sleep_ammount)
        return user_message


if __name__ == '__main__':
    assistant = Assistant()
    assistant.submit_message('who is matt')
    return_message = assistant.submit_message('who is obama')
    print(return_message)
    return_message = assistant.submit_message('how tall is he')
    print(return_message)
