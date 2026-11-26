# AWS credentials: no long-lived keys

Nirog calls Amazon Bedrock, Amazon Polly and Amazon Transcribe Streaming. All
three clients get their credentials from one place,
[`src/lib/aws/credentials.ts`](../../src/lib/aws/credentials.ts).

## Why

An AWS Well-Architected review of this repo (Security pillar, run with the
`aws-well-architected-review` skill from the Agent Toolkit for AWS) rated this
finding Critical:

> SEC02-BP02 Use temporary credentials — Not Implemented. One long-lived IAM user
> key was shared by developer machines, Vercel preview and Vercel production.

It was a 100-day-old access key for IAM user `nirog-app`. That user carried
`AmazonPollyFullAccess` and `AmazonTranscribeFullAccess`, so a leaked key could
also delete lexicons and read or delete other transcription jobs.

## How it works now

| Where | Credential source | Lifetime |
|---|---|---|
| Vercel Production and Preview | Vercel OIDC token → `sts:AssumeRoleWithWebIdentity` → role `nirog-vercel-oidc` | 15 minutes, refreshed automatically |
| Local development | SDK default chain: `aws login` / `aws sso login` with `AWS_PROFILE` | session-based |

The role trusts only this Vercel project's `production` and `preview`
environments:

```json
"Condition": {
  "StringEquals": { "oidc.vercel.com/shivcreates:aud": "https://vercel.com/shivcreates" },
  "StringLike": { "oidc.vercel.com/shivcreates:sub": [
    "owner:shivcreates:project:nirog-memory:environment:production",
    "owner:shivcreates:project:nirog-memory:environment:preview"
  ]}
}
```

It can do exactly three things:

| Action | Resource |
|---|---|
| `bedrock:InvokeModel` | `amazon.titan-embed-text-v2:0` and `openai.gpt-oss-120b-1:0`, us-west-2 |
| `polly:SynthesizeSpeech` | `*` (Polly has no resource-level permissions) |
| `transcribe:StartStreamTranscription` | `*` |

## Vercel setup

1. In Project Settings → Security, turn on Secure backend access with OIDC
   federation (Team issuer mode).
2. In Environment Variables (Production and Preview), add
   `AWS_ROLE_ARN=arn:aws:iam::<account>:role/nirog-vercel-oidc` and keep
   `AWS_REGION=us-west-2`.
3. Delete `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` from every
   environment, then redeploy.
4. Check `GET /api/aria/health` returns `ok: true`, and that CloudTrail shows
   `AssumedRole/nirog-vercel-oidc/nirog-vercel` on Bedrock, Polly and
   Transcribe calls.
5. Deactivate the IAM user's access key. Delete it once nothing has failed for
   a day.
