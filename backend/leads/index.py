import json
import os

import psycopg2

def handler(event: dict, context) -> dict:
    """Приём заявок с лендинга срочного выкупа квартир"""
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    if event.get('httpMethod') != 'POST':
        return {'statusCode': 405, 'headers': cors, 'body': json.dumps({'error': 'Method not allowed'})}

    body = json.loads(event.get('body') or '{}')
    phone = (body.get('phone') or '').strip()

    if not phone:
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Телефон обязателен'})}

    name = (body.get('name') or '').strip()
    address = (body.get('address') or '').strip()
    comment = (body.get('comment') or '').strip()
    source = (body.get('source') or 'form').strip()

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO leads (name, phone, address, comment, source) VALUES (%s, %s, %s, %s, %s) RETURNING id",
        (name or None, phone, address or None, comment or None, source)
    )
    lead_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': {**cors, 'Content-Type': 'application/json'},
        'body': {'ok': True, 'id': lead_id}
    }