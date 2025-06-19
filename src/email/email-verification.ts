import nodemailer from 'nodemailer'

export async function sendVerificationEmail(email: string, code: string) {
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
    from: `"byeolstar.com" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🔐 byeolstar 인증번호 안내',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🔐 이메일 인증</h1>
          <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">안녕하세요, byeolstar입니다!</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
          <h2 style="color: #333; margin-top: 0; font-size: 20px;">회원가입 인증번호</h2>
          <p style="color: #6c757d; margin-bottom: 20px;">아래 인증번호를 입력하여 회원가입을 완료해주세요.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border: 2px dashed #667eea; margin: 20px 0;">
            <div style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 4px; font-family: 'Courier New', monospace;">
              ${code}
            </div>
          </div>
          
          <p style="color: #dc3545; font-weight: bold; margin: 15px 0 5px 0;">⏰ 유효시간: 5분</p>
          <p style="color: #6c757d; font-size: 14px; margin: 0;">시간 내에 인증을 완료해주세요.</p>
        </div>
        
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
          <p style="margin: 0; color: #856404; font-size: 14px;">
            <strong>⚠️ 보안 안내:</strong> 본인이 요청하지 않은 인증번호라면 이 메일을 무시해주세요.
          </p>
        </div>
        
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3;">
          <p style="margin: 0; color: #1565c0; font-size: 14px;">
            <strong>💡 도움말:</strong> 인증번호가 보이지 않거나 만료되었다면 다시 요청해주세요.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
          <p style="color: #6c757d; font-size: 12px; margin: 0;">
            이 메일은 자동으로 발송된 인증 메일입니다. 회신하지 마세요.
          </p>
          <p style="color: #6c757d; font-size: 12px; margin: 5px 0 0 0;">
            © 2025 webstoryboy.com. All rights reserved.
          </p>
        </div>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`회원가입 인증번호가 ${email}로 전송되었습니다.`)
  } catch (error) {
    console.error('회원가입 인증번호 전송 실패:', error)
    throw new Error('이메일 전송 실패')
  }
}
