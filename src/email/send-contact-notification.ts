import nodemailer from 'nodemailer'
import { APP_NAME, APP_COPYRIGHT } from '@/lib/constants'

// 문의 알림 이메일 발송 함수
export async function sendContactNotification(contactInfo: {
  email: string
  message: string
  contactDate: Date
}) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.naver.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    // 관리자 이메일 주소
    const adminEmail = process.env.ADMIN_EMAIL || 'webstoryboy@naver.com'

    const mailOptions = {
      from: `"${APP_NAME}" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `📧 ${APP_NAME} 새로운 문의 알림`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">📧 새로운 문의</h1>
            <p style="color: #f0f0f0; margin: 1px 0 0 0; font-size: 16px;">새로운 문의가 접수되었습니다</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0; font-size: 20px;">문의자 정보</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057; width: 120px;">이메일:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #6c757d;">
                  <a href="mailto:${
                    contactInfo.email
                  }" style="color: #007bff; text-decoration: none;">${
        contactInfo.email
      }</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #495057;">문의일시:</td>
                <td style="padding: 10px 0; color: #6c757d;">${contactInfo.contactDate.toLocaleString(
                  'ko-KR'
                )}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #1565c0; margin-top: 20px; font-size: 18px;">💬 문의 내용</h3>
            <p style="color: #333; margin: 0; line-height: 1.6; white-space: pre-wrap;">${
              contactInfo.message
            }</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
            <p style="color: #6c757d; font-size: 12px; margin: 0;">
              이 메일은 자동으로 발송된 알림입니다. 회신하지 마세요.
            </p>
            <p style="color: #6c757d; font-size: 12px; margin: 5px 0 0 0;">
              ${APP_COPYRIGHT}
            </p>
          </div>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log(`문의 알림 이메일이 ${adminEmail}로 전송되었습니다.`)

    return { success: true }
  } catch (error) {
    console.error('문의 알림 이메일 발송 실패:', error)
    return { success: false, error: error }
  }
}

// 문의자에게 자동 답변 이메일 발송 (선택사항)
export async function sendContactConfirmation(contactInfo: {
  email: string
  title: string
  message: string
  contactDate: Date
}) {
  try {
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
      to: contactInfo.email,
      subject: `✅ ${APP_NAME} 문의 접수 확인`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">✅ 문의 접수 완료</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">안녕하세요!</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0; font-size: 20px;">문의가 정상적으로 접수되었습니다</h2>
            <p style="color: #6c757d; margin-bottom: 20px;">소중한 문의를 주셔서 감사합니다. 빠른 시일 내에 답변드리겠습니다.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
              <h3 style="color: #333; margin-top: 0; font-size: 16px;">📋 접수된 문의 내용</h3>
              <p style="margin: 5px 0;"><strong>제목:</strong> ${
                contactInfo.title
              }</p>
              <p style="margin: 5px 0;"><strong>접수일시:</strong> ${contactInfo.contactDate.toLocaleString(
                'ko-KR'
              )}</p>
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e9ecef;">
                <p style="margin: 0; color: #6c757d; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${
                  contactInfo.message
                }</p>
              </div>
            </div>
          </div>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3; margin-bottom: 20px;">
            <p style="margin: 0; color: #1565c0; font-size: 14px;">
              <strong>⏰ 답변 예정:</strong> 영업일 기준 24시간 내에 답변드릴 예정입니다.
            </p>
          </div>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              <strong>📞 긴급 문의:</strong> 긴급한 사항이 있으시면 고객센터로 연락해주세요.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
            <p style="color: #6c757d; font-size: 12px; margin: 0;">
              이 메일은 자동으로 발송된 확인 메일입니다.
            </p>
            <p style="color: #6c757d; font-size: 12px; margin: 5px 0 0 0;">
              ${APP_COPYRIGHT}
            </p>
          </div>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log(`문의 확인 이메일이 ${contactInfo.email}로 전송되었습니다.`)

    return { success: true }
  } catch (error) {
    console.error('문의 확인 이메일 발송 실패:', error)
    return { success: false, error: error }
  }
}
