import nodemailer from 'nodemailer'
import { APP_NAME, APP_COPYRIGHT } from '@/lib/constants'

export async function sendVerificationPassword(email: string, code: string) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.naver.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  const mailOptions = {
    from: `"${APP_NAME}" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `🔑 ${APP_NAME} 비밀번호 재설정 인증번호`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🔑 비밀번호 재설정</h1>
          <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">안녕하세요, ${APP_NAME}입니다!</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
          <h2 style="color: #333; margin-top: 0; font-size: 20px;">비밀번호 재설정 인증번호</h2>
          <p style="color: #6c757d; margin-bottom: 20px;">아래 인증번호를 입력하여 비밀번호를 재설정하세요.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border: 2px dashed #ff6b6b; margin: 20px 0;">
            <div style="font-size: 32px; font-weight: bold; color: #ff6b6b; letter-spacing: 4px; font-family: 'Courier New', monospace;">
              ${code}
            </div>
          </div>
          
          <p style="color: #dc3545; font-weight: bold; margin: 15px 0 5px 0;">⏰ 유효시간: 5분</p>
          <p style="color: #6c757d; font-size: 14px; margin: 0;">시간 내에 인증을 완료해주세요.</p>
        </div>
        
        <div style="background: #f8d7da; padding: 20px; border-radius: 8px; border-left: 4px solid #dc3545; margin-bottom: 20px;">
          <p style="margin: 0; color: #721c24; font-size: 14px;">
            <strong>🚨 보안 경고:</strong> 본인이 요청하지 않은 비밀번호 재설정이라면 즉시 고객센터에 문의하거나 이 메일을 무시해주세요.
          </p>
        </div>
        
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3;">
          <p style="margin: 0; color: #1565c0; font-size: 14px;">
            <strong>💡 도움말:</strong> 인증번호 입력 후 새로운 비밀번호를 설정할 수 있습니다.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
          <p style="color: #6c757d; font-size: 12px; margin: 0;">
            이 메일은 자동으로 발송된 인증 메일입니다. 회신하지 마세요.
          </p>
          <p style="color: #6c757d; font-size: 12px; margin: 5px 0 0 0;">
             ${APP_COPYRIGHT}
          </p>
        </div>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`비밀번호 재설정 인증번호가 ${email}로 전송되었습니다.`)
  } catch (error) {
    console.error('비밀번호 재설정 인증번호 전송 실패:', error)
    throw new Error('이메일 전송 실패')
  }
}
